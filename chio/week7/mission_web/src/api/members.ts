import { apiClient } from './api-client'

type Availability = { available: boolean }
type SignupRequest = { email: string; nickname: string; password: string }
type SignupResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: { memberId: number; email: string; nickname: string }
}

export function checkMemberAvailability(field: 'email' | 'nickname', value: string) {
  return apiClient.get(`members/${field}/${encodeURIComponent(value)}`).json<Availability>()
}

export function signup(body: SignupRequest) {
  return apiClient.post('members', { json: body }).json<SignupResponse>()
}
