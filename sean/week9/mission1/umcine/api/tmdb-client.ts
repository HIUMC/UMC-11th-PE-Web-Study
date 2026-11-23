// 이 모듈은 Server Component에서만 import 합니다. (TMDB 토큰이 서버 전용이기 때문)
import ky from "ky";
import { serverEnv } from "@/config/server-env";

export const tmdbClient = ky.create({
  baseUrl: `${serverEnv.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${serverEnv.tmdbAccessToken}`,
  },
});
