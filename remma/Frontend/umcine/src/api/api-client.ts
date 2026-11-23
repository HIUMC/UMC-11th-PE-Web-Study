import ky from "ky";
import { env } from "../config/env";

/** 인증이 필요 없는 요청(회원가입, 로그인, 중복 확인 등)에 사용하는 기본 API 클라이언트예요. */
export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
});
