import { isHTTPError, type KyInstance } from 'ky'
import { getMemberClient, MemberConfigError } from '../api-client.ts'

export type DuplicateField = 'email' | 'nickname'
export interface SignupRequest { email: string; nickname: string; password: string }
export interface SignupResponse {
  isSuccess: true
  code: string
  message: string
  result: { memberId: number; email: string; nickname: string }
}
export class MemberResponseError extends Error {
  constructor() { super('회원 서버 응답 형식이 올바르지 않아요. 잠시 후 다시 시도해 주세요.'); this.name = 'MemberResponseError' }
}
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }
async function readJson(request: PromiseLike<Response>): Promise<unknown> {
  const response = await request
  try { return await response.json() } catch { throw new MemberResponseError() }
}
export async function checkDuplicate(field: DuplicateField, value: string, signal?: AbortSignal, client: KyInstance = getMemberClient()): Promise<boolean> {
  const data: unknown = await readJson(client.get(`members/${field}/${encodeURIComponent(value.trim())}`, { signal }))
  if (!record(data) || typeof data.available !== 'boolean') throw new MemberResponseError()
  return data.available
}
export async function signup(body: SignupRequest, client: KyInstance = getMemberClient()): Promise<SignupResponse> {
  // passwordConfirm 등 UI 전용 값이 넘어와도 전송 필드는 명시적으로 제한한다.
  const data: unknown = await readJson(client.post('members', { json: { email: body.email.trim(), nickname: body.nickname.trim(), password: body.password } }))
  if (!record(data) || data.isSuccess !== true || typeof data.code !== 'string' || typeof data.message !== 'string' || !record(data.result)) throw new MemberResponseError()
  const { memberId, email, nickname } = data.result
  if (typeof memberId !== 'number' || !Number.isSafeInteger(memberId) || memberId <= 0 || typeof email !== 'string' || typeof nickname !== 'string') throw new MemberResponseError()
  return { isSuccess: true, code: data.code, message: data.message, result: { memberId, email, nickname } }
}

export interface MemberFailure { message: string; status?: number; duplicateField?: DuplicateField }
export async function memberFailure(error: unknown): Promise<MemberFailure> {
  if (error instanceof MemberConfigError || error instanceof MemberResponseError) return { message: error.message }
  if (isHTTPError(error)) {
    const status = error.response.status
    // ky 2는 오류 body를 이미 읽어 data에 제공한다. response.json() 재호출은 실패한다.
    const data: unknown = error.data
    const code = record(data) ? data.code : undefined
    // 확인한 서버 계약의 공개 메시지만 사용한다. 임의 응답이 비밀번호를 반사하지 않게 한다.
    if (status === 409 && code === 'MEMBER4091') return { status, duplicateField: 'email', message: '이미 사용 중인 이메일입니다. 다시 확인해 주세요.' }
    if (status === 409 && code === 'MEMBER4092') return { status, duplicateField: 'nickname', message: '이미 사용 중인 닉네임입니다. 다시 확인해 주세요.' }
    return { status, message: status === 400 ? '입력값을 확인해 주세요. 이메일·닉네임·비밀번호 조건을 다시 확인해 주세요.' : status === 409 ? '중복된 회원 정보가 있어요. 이메일과 닉네임을 다시 확인해 주세요.' : '회원 서버 요청에 실패했어요. 잠시 후 다시 시도해 주세요.' }
  }
  return { message: '회원 서버에 연결하지 못했어요. 서버 실행·주소·네트워크·CORS 설정을 확인해 주세요.' }
}
