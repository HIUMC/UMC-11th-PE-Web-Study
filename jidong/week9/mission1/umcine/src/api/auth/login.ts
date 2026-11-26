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

export function login(body: LoginRequest) {
  return umcineClient.post("auth/login", { json: body }).json<LoginResponse>();
}
