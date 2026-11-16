import { umcineClient } from "../umcine-client";

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

// 로그인은 토큰이 필요 없어서 authApi 말고 umcineClient로 요청함
export function login(body: LoginRequest) {
  return umcineClient.post("auth/login", { json: body }).json<LoginResponse>();
}
