import { apiClient, authApi, type ApiResponse } from "../api-client";

export type LoginRequest = { email: string; password: string };
type LoginResult = { nickname: string; accessToken: string };
export type MemberInfo = { email: string; nickname: string; createdAt: string };

export async function login(body: LoginRequest) {
  const response = await apiClient.post("auth/login", { json: body })
    .json<ApiResponse<LoginResult>>();
  if (!response.isSuccess || typeof response.result?.accessToken !== "string" ||
      !response.result.accessToken.trim()) {
    throw new Error("로그인 응답 형식이 올바르지 않아요.");
  }
  return response.result;
}

export async function getMe(sessionId: number, signal: AbortSignal) {
  const response = await authApi.get("members/me", { signal, context: { sessionId } })
    .json<ApiResponse<MemberInfo>>();
  return response.result;
}

export async function updateMe(sessionId: number, nickname: string) {
  const response = await authApi.patch("members/me", {
    json: { nickname },
    context: { sessionId },
  }).json<ApiResponse<MemberInfo>>();
  return response.result;
}
