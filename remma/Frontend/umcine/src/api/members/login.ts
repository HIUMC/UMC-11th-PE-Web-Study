import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  memberId: number;
  email: string;
  nickname: string;
  accessToken: string;
}

export type LoginResponse = ApiResponse<LoginResult>;

export function login(request: LoginRequest) {
  return apiClient
    .post("auth/login", { json: request })
    .json<LoginResponse>();
}
