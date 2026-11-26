import { apiClient, authenticatedResult, authHeaders, type ApiResponse } from "../api-client";

export interface MemberProfile { email: string; nickname: string; createdAt: string }
export function getMe() {
  return authenticatedResult(apiClient.get("members/me", { headers: authHeaders() }).json<ApiResponse<MemberProfile>>());
}
export function updateMe(nickname: string) {
  return authenticatedResult(apiClient.patch("members/me", { headers: authHeaders(), json: { nickname } }).json<ApiResponse<MemberProfile>>());
}
