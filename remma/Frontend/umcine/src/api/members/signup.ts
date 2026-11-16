import { apiClient } from "../api-client";

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface MemberResult {
  memberId: number;
  email: string;
  nickname: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberResult | null;
}

export function signup(request: SignupRequest) {
  return apiClient
    .post("members", { json: request })
    .json<SignupResponse>();
}