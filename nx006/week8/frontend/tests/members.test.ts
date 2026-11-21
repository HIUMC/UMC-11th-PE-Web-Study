import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemberClient, readMemberBaseUrl, MemberConfigError } from '../src/api/api-client.ts'
import { checkDuplicate, signup, memberFailure, MemberResponseError } from '../src/api/members/member-api.ts'
import { validateSignup, canSubmitSignup, emptyDuplicate } from '../src/utils/signup-validation.ts'

const valid = { email: ' test@example.com ', nickname: ' 영화팬 ', password: 'Test123!', passwordConfirm: 'Test123!' }
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }) }

test('회원가입 유효성 경계와 허용 문자·trim·반복 regex 검사', () => {
  assert.ok(Object.values(validateSignup(valid)).every(Boolean))
  for (const email of ['', 'x', 'a@b', 'a @b.com']) assert.equal(validateSignup({ ...valid, email }).email, false)
  for (const nickname of ['', '가', '가'.repeat(13)]) assert.equal(validateSignup({ ...valid, nickname }).nickname, false)
  for (const nickname of ['가나', '가'.repeat(12), '😀😀']) assert.equal(validateSignup({ ...valid, nickname }).nickname, true)
  for (const password of ['Test12!', 'test123!', 'TEST123!', 'Testabcd!', 'Test1234', 'Test123! ', 'Test123!한', 'Test123!_', 'Aa1!' + 'a'.repeat(69)]) assert.equal(validateSignup({ ...valid, password }).password, false)
  assert.equal(validateSignup({ ...valid, password: 'Aa1!' + 'a'.repeat(68) }).password, true)
  for (const passwordConfirm of ['', 'test123!', 'Test123! ']) assert.equal(validateSignup({ ...valid, passwordConfirm }).passwordConfirm, false)
  for (let i = 0; i < 5; i++) assert.equal(validateSignup(valid).email, true)
})

test('두 중복 확인은 검사한 값에만 유효하며 checking/invalid 상태에서는 제출 불가', () => {
  const duplicates = { email: emptyDuplicate(), nickname: emptyDuplicate() }
  assert.equal(canSubmitSignup(valid, duplicates), false)
  duplicates.email = { isChecking: false, isAvailable: true, checkedValue: valid.email.trim() }
  assert.equal(canSubmitSignup(valid, duplicates), false)
  duplicates.nickname = { isChecking: false, isAvailable: true, checkedValue: valid.nickname.trim() }
  assert.equal(canSubmitSignup(valid, duplicates), true)
  assert.equal(canSubmitSignup({ ...valid, email: 'other@example.com' }, duplicates), false)
  duplicates.email.isChecking = true
  assert.equal(canSubmitSignup(valid, duplicates), false)
})

test('회원 클라이언트 주소 검증: 빈 설정에서 프론트로 요청하지 않음', () => {
  for (const base of ['', '/api', 'ftp://localhost', 'http://u:p@localhost', 'http://localhost/?secret=x']) assert.throws(() => readMemberBaseUrl({ VITE_API_BASE_URL: base }), MemberConfigError)
  assert.equal(readMemberBaseUrl({ VITE_API_BASE_URL: 'http://localhost:3000/api///' }), 'http://localhost:3000/api/')
  assert.equal(readMemberBaseUrl({ VITE_MOVIE_API_BASE_URL: 'http://localhost:3000' }), 'http://localhost:3000/')
})

test('중복 확인 path segment 인코딩·응답 검사·인증 헤더 없음', async () => {
  const seen: Request[] = []
  const client = createMemberClient('http://localhost:3000/api', async request => { seen.push(request as Request); return json({ available: true }) })
  assert.equal(await checkDuplicate('email', ' a+b@example.com ', undefined, client), true)
  assert.equal(await checkDuplicate('nickname', '영화/#팬', undefined, client), true)
  assert.equal(seen[0].url, 'http://localhost:3000/api/members/email/a%2Bb%40example.com')
  assert.ok(seen[1].url.endsWith(encodeURIComponent('영화/#팬')))
  assert.equal(seen[0].headers.has('Authorization'), false)
  for (const data of [{}, { available: 'true' }, null, []]) {
    const invalid = createMemberClient('http://localhost:3000', async () => json(data))
    await assert.rejects(checkDuplicate('email', 'x@y.com', undefined, invalid), MemberResponseError)
  }
  const broken = createMemberClient('http://localhost:3000', async () => new Response('{broken', { headers: { 'Content-Type': 'application/json' } }))
  await assert.rejects(checkDuplicate('email', 'x@y.com', undefined, broken), MemberResponseError)
})

test('가입 JSON은 세 필드만 포함하며 성공 envelope를 런타임 검증', async () => {
  const client = createMemberClient('http://localhost:3000', async request => {
    const req = request as Request
    const body = await req.json()
    assert.deepEqual(body, { email: 'test@example.com', nickname: '영화팬', password: valid.password })
    assert.equal(req.method, 'POST'); assert.equal(req.headers.has('Authorization'), false)
    return json({ isSuccess: true, code: 'COMMON201', message: '회원가입에 성공했습니다.', result: { memberId: 1, email: body.email, nickname: body.nickname } }, 201)
  })
  assert.equal((await signup(valid, client)).result.memberId, 1)
  for (const data of [{ isSuccess: false }, { isSuccess: true, code: 'OK', message: 'OK', result: { memberId: '1', email: 'x', nickname: 'y' } }, {}]) {
    await assert.rejects(signup(valid, createMemberClient('http://localhost:3000', async () => json(data))), MemberResponseError)
  }
})

test('POST 오류·네트워크 실패를 자동 재전송하지 않으며 메시지에 임의 payload를 반사하지 않음', async () => {
  for (const status of [400, 409, 500]) {
    let calls = 0
    const client = createMemberClient('http://localhost:3000', async () => { calls++; return json({ code: status === 409 ? 'MEMBER4091' : 'OTHER', message: 'sensitive-reflected-body' }, status) })
    try { await signup(valid, client); assert.fail('must reject') } catch (error) {
      const failure = await memberFailure(error)
      assert.equal(failure.status, status)
      assert.equal(failure.duplicateField, status === 409 ? 'email' : undefined)
      assert.equal(failure.message.includes('sensitive'), false)
    }
    assert.equal(calls, 1)
  }
  let calls = 0
  try { await signup(valid, createMemberClient('http://localhost:3000', async () => { calls++; throw new TypeError('network') })) } catch (error) {
    assert.match((await memberFailure(error)).message, /네트워크.*CORS/)
  }
  assert.equal(calls, 1)
})
