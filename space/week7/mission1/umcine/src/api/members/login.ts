import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  accessToken: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function login(body: LoginRequest) {
  return apiClient
    .post("auth/login", { json: body })
    .json<ApiResponse<LoginResponse>>();
}
