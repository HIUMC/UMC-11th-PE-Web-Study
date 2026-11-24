import "server-only";
import ky from "ky";
import { getTmdbEnv } from "../config/env";

export function getTmdbClient() {
  const { tmdbApiBaseUrl, tmdbAccessToken } = getTmdbEnv();

  return ky.create({
    baseUrl: `${tmdbApiBaseUrl}/`,
    headers: {
      Authorization: `Bearer ${tmdbAccessToken}`,
    },
  });
}
