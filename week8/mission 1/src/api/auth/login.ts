import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

export async function login(body: LoginRequest) {
  const response = await apiClient.post("auth/login", { json: body }).json<LoginResponse>();
  if (!response.isSuccess || !response.result?.accessToken) {
    throw new Error(response.message || "로그인에 실패했어요.");
  }
  return response;
}
