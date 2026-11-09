import ky from "ky";
import { env } from "../config/env";

// TMDB가 아니라 백엔드(회원, 평점) 호출용 인스턴스임
export const umcineClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
