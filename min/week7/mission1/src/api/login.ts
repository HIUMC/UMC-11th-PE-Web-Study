import { apiClient, type ApiResponse } from "./api-client";

export function login(email: string, password: string) {
  return apiClient.post("auth/login", { json: { email, password } }).json<ApiResponse<{ nickname: string; accessToken: string }>>();
}
