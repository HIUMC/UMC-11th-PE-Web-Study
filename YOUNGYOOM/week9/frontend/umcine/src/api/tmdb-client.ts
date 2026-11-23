import ky from "ky";
import { env } from "../config/env";

export function createTmdbClient() {
  const { tmdbApiBaseUrl, tmdbAccessToken } = env;

  if (!tmdbApiBaseUrl || !tmdbAccessToken) {
    throw new Error("TMDB 환경 변수가 필요해요.");
  }

  return ky.create({
    baseUrl: `${tmdbApiBaseUrl.replace(/\/+$/, "")}/`,
    headers: {
      Authorization: `Bearer ${tmdbAccessToken}`,
    },
  });
}
