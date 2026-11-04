import ky from "ky";
import { env } from "../config/env";

// TMDB가 아닌 우리 백엔드(회원, 평점)를 호출할 때 사용하는 인스턴스예요.
export const umcineClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
