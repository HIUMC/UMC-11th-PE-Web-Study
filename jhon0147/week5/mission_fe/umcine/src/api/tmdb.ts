import ky, { HTTPError, TimeoutError } from "ky";
import { createMovieService } from "./movie-service";

export const tmdbBaseUrl = (
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3"
).replace(/\/+$/, "");
const token = (import.meta.env.VITE_TMDB_TOKEN || "").trim();

export function checkTmdbConfiguration() {
  if (!token || token === "YOUR_TMDB_READ_ACCESS_TOKEN") {
    throw new Error(
      "TMDB 토큰을 설정해 주세요. .env.local에 VITE_TMDB_TOKEN을 입력한 뒤 개발 서버를 다시 시작해 주세요.",
    );
  }
}

export const tmdb = ky.create({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
  timeout: 10_000,
  retry: 0,
});

export const movieService = createMovieService(tmdb, tmdbBaseUrl, checkTmdbConfiguration);

export function getRequestErrorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    if (status === 401) return "인증에 실패했어요. TMDB 토큰을 확인해 주세요. (401)";
    if (status === 404) return "영화를 찾을 수 없어요. 영화 번호를 확인해 주세요. (404)";
    if (status === 429) return "요청이 많아요. 잠시 후 다시 시도해 주세요. (429)";
    return `영화 정보를 불러오지 못했어요. (HTTP ${status})`;
  }
  if (error instanceof TimeoutError) return "응답 시간이 길어지고 있어요. 다시 시도해 주세요.";
  if (error instanceof TypeError) return "연결을 확인해 주세요. 네트워크 또는 CORS 문제일 수 있어요.";
  return error instanceof Error ? error.message : "영화 정보를 불러오지 못했어요.";
}
