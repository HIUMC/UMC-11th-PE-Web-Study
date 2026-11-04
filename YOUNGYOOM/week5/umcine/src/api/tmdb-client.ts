import ky from "ky";
import { env } from "../config/env";

//tmdb에 요청을 보내도록 미리 설정해둔 클라이언트
//기본주소/인증토큰 헤더에 붙여줌
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
