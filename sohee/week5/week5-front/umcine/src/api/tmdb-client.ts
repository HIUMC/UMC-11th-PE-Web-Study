import ky from "ky";
import { env } from "../config/env";

type QueryParams = Record<string, string | number | undefined>;

const tmdbClient = ky.create({
  prefix: env.tmdbBaseUrl,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});

// 실패한 응답은 ky가 HTTPError로 던져요.
export function tmdbGet<T>(path: string, params: QueryParams = {}): Promise<T> {
  const searchParams: Record<string, string | number> = { language: "ko-KR" };
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams[key] = value;
  });

  return tmdbClient.get(path, { searchParams }).json<T>();
}
