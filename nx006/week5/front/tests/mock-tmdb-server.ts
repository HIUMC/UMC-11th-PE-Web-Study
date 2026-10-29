// 검증 전용 서버. 실제 앱 번들·라우트에 import하지 않는다. 토큰/headers를 로그하지 않는다.
import { createServer } from 'node:http'
import { fixtureDetail, fixtureList } from './tmdb-fixtures.ts'
let fail = false
const server = createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5175')
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  response.setHeader('Content-Type', 'application/json')
  if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return }
  const url = new URL(request.url!, 'http://127.0.0.1:5174')
  if (url.pathname === '/__control') { fail = url.searchParams.get('fail') === '1'; response.end(JSON.stringify({ fail })); return }
  const page = Number(url.searchParams.get('page') ?? 1), query = url.searchParams.get('query') ?? ''
  const send = () => {
    let status = 200, body: unknown
    if (fail) { status = 500; body = { status_message: 'Controlled mock failure' } }
    else if (url.pathname === '/3/movie/popular' || url.pathname === '/3/search/movie') {
      body = query === 'empty' ? { page, results: [], total_pages: 0, total_results: 0 } : fixtureList(page, query)
      if (page > 3) body = { page, results: [], total_pages: 3, total_results: 15 }
    } else if (/^\/3\/movie\/\d+$/.test(url.pathname) && Number(url.pathname.split('/').at(-1)) >= 101 && Number(url.pathname.split('/').at(-1)) <= 115) body = fixtureDetail(Number(url.pathname.split('/').at(-1)))
    else { status = 404; body = { status_message: 'Controlled mock 404' } }
    response.writeHead(status); response.end(JSON.stringify(body))
    console.log(JSON.stringify({ path: url.pathname, query, page, status }))
  }
  setTimeout(send, query === 'slow' ? 2500 : 300)
})
server.listen(5174, '127.0.0.1', () => console.log('Mock TMDB: http://127.0.0.1:5174/3 (테스트 전용)'))
