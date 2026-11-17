import ky from "ky";
import { env } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  // 자동 재시도는 TanStack Query 한 곳에서 관리한다.
  retry: 0,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
