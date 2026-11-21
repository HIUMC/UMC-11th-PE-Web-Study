import assert from 'node:assert/strict'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// 개념 실습 전용. 앱 인증에 연결하지 않으며 실제 토큰·사용자·키를 읽지 않는다.
const key = randomBytes(32)
const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url')
const header = encode({ alg: 'HS256', typ: 'JWT' })
const payload = encode({ sub: 'practice-user', role: 'viewer', exp: 2_000_000_000 })
const sign = (value: string) => createHmac('sha256', key).update(value).digest()
const signature = sign(`${header}.${payload}`)
const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
assert.equal(decoded.role, 'viewer')
const changed = encode({ ...decoded, role: 'admin' })
assert.equal(JSON.parse(Buffer.from(changed, 'base64url').toString()).role, 'admin')
assert.equal(timingSafeEqual(signature, sign(`${header}.${changed}`)), false)
console.log(JSON.stringify({ check: 'synthetic JWT exercise', decodedRole: decoded.role, changedPayloadCanDecode: true, changedSignatureValid: false, realTokenUsed: false }))
