import { apiClient } from './api-client'
import { authApi } from './auth-api'
import { unwrap, type ApiResponse } from './api-response'

type Availability = { available: boolean }
type Credentials = { email: string; password: string }
export type MemberInfo = { email: string; nickname: string; createdAt: string }

export function checkMemberAvailability(field: 'email' | 'nickname', value: string) {
  return apiClient.get(`members/${field}/${encodeURIComponent(value)}`).json<Availability>()
}

export function signup(body: Credentials & { nickname: string }) {
  return apiClient.post('members', { json: body }).json<ApiResponse<{ memberId: number; email: string; nickname: string }>>()
}

export function login(body: Credentials) {
  return unwrap(apiClient.post('auth/login', { json: body }).json<ApiResponse<{ nickname: string; accessToken: string }>>())
}

export function getMe(signal: AbortSignal) {
  return unwrap(authApi.get('members/me', { signal }).json<ApiResponse<MemberInfo>>())
}

export function updateMe(nickname: string) {
  return unwrap(authApi.patch('members/me', { json: { nickname } }).json<ApiResponse<MemberInfo>>())
}
