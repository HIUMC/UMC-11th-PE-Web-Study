import { apiClient } from "../api-client";
import type { ApiResponse } from "../../types/api";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  memberId: number;
  email: string;
  nickname: string;
}

export function signup(body: SignupRequest) {
  return apiClient
    .post("members", { json: body })
    .json<ApiResponse<SignupResponse>>();
}
