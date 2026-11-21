import { createServer } from 'node:http'

// 브라우저 오류/지연/중복 제출 검증 전용. 비밀번호·payload를 기록하지 않는다.
const events: { method: string; status: number; fields?: string[] }[] = []
let failure = 0
let delay = 1500
createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5178')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'content-type')
  response.setHeader('Content-Type', 'application/json')
  const url = new URL(request.url ?? '/', 'http://localhost:3011')
  const send = (status: number, data: unknown) => { response.statusCode = status; response.end(JSON.stringify(data)) }
  if (request.method === 'OPTIONS') { response.writeHead(204).end(); return }
  if (url.pathname === '/__stats') { send(200, events); return }
  if (url.pathname === '/__control') {
    failure = Number(url.searchParams.get('status') ?? 0)
    delay = Number(url.searchParams.get('delay') ?? 1500)
    if (url.searchParams.has('reset')) events.length = 0
    send(200, { failure, delay }); return
  }
  const event: { method: string; status: number; fields?: string[] } = { method: request.method ?? '', status: 0 }
  events.push(event)
  let body: Record<string, unknown> = {}
  if (request.method === 'POST') {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    try { body = JSON.parse(Buffer.concat(chunks).toString()) } catch { send(400, {}); return }
    event.fields = Object.keys(body).sort()
  }
  setTimeout(() => {
    const status = failure || (request.method === 'POST' ? 201 : 200)
    event.status = status
    if (status >= 400) { send(status, { isSuccess: false, code: status === 409 ? 'MEMBER4091' : `COMMON${status}`, message: '모의 오류', result: null }); return }
    if (request.method === 'GET') send(200, { available: !decodeURIComponent(url.pathname).includes('duplicate') })
    else send(201, { isSuccess: true, code: 'COMMON201', message: '회원가입에 성공했습니다.', result: { memberId: 900001, email: body.email, nickname: body.nickname } })
  }, delay)
}).listen(3011, 'localhost', () => console.log('Mock members: http://localhost:3011 (no sensitive payload logging)'))
