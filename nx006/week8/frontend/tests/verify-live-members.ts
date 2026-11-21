import assert from 'node:assert/strict'
import { loadEnv } from 'vite'
import { randomBytes } from 'node:crypto'
import { createMemberClient, readMemberBaseUrl } from '../src/api/api-client.ts'
import { checkDuplicate, memberFailure, signup } from '../src/api/members/member-api.ts'

// 로컬 개발 DB에 격리된 테스트 회원 1개를 생성한다. 기존 데이터를 삭제하지 않는다.
const env = loadEnv('development', process.cwd(), 'VITE_')
const base = readMemberBaseUrl(env)
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('이 검증은 로컬 개발 서버에서만 실행합니다.')
const suffix = Date.now().toString(36)
const body = { email: `week7-${suffix}@example.com`, nickname: `w7${suffix}`.slice(0, 12), password: `Aa1!${randomBytes(12).toString('hex')}` }
const client = createMemberClient(base)
async function expectFailure(input: typeof body, status: number, field?: string) {
  let rejected = false
  try { await signup(input, client) } catch (error) {
    rejected = true
    const failure = await memberFailure(error)
    assert.equal(failure.status, status)
    assert.equal(failure.duplicateField, field)
  }
  assert.equal(rejected, true)
}
try {
  assert.equal(await checkDuplicate('email', body.email, undefined, client), true)
  assert.equal(await checkDuplicate('nickname', body.nickname, undefined, client), true)
  const result = await signup(body, client)
  assert.equal(result.isSuccess, true)
  assert.equal(await checkDuplicate('email', body.email, undefined, client), false)
  assert.equal(await checkDuplicate('nickname', body.nickname, undefined, client), false)
  await expectFailure(body, 409, 'email')
  await expectFailure({ ...body, email: `other-${suffix}@example.com` }, 409, 'nickname')
  await expectFailure({ ...body, email: 'invalid' }, 400)
  const preflight = await fetch(new URL('members', base), { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } })
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'http://localhost:5173')
  assert.match(preflight.headers.get('access-control-allow-methods') ?? '', /POST/)
  assert.match(preflight.headers.get('access-control-allow-headers') ?? '', /content-type/i)
  console.log(JSON.stringify({ check: 'real local NestJS', signup: 201, memberId: result.result.memberId, duplicateEmail: 409, duplicateNickname: 409, invalid: 400, preflight: 204, origin: 'http://localhost:5173', testMembersCreated: 1 }))
} catch (error) {
  console.error(JSON.stringify({ check: 'real local NestJS', passed: false, ...(await memberFailure(error)) }))
  process.exitCode = 1
}
