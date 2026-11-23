//api/members/login.ts
import { apiClient } from "../api-client";
import type { ApiResponse } from "../../types/api";

//로그인 API에 보낼 값
export interface LoginRequest {
  email: string;
  password: string;
}

//서버가 보내는 로그인 응답 구조
export interface LoginResponse {
  nickname: string;
  accessToken: string;
}

export function login(body: LoginRequest) {
    //토큰 발급 받는 요청 -> 일반 apiClient 사용
    //이메일과 비밀번호를 JSON으로 보내고, 응답도 JSON으로 읽음
  return apiClient
    .post("auth/login", { json: body })
    .json<ApiResponse<LoginResponse>>();
}
