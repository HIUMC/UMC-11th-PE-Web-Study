import { checkTmdbConfiguration, tmdbBaseUrl } from "./tmdb";
import { toMoviePage } from "./movie-mappers";

// fetch의 상태 확인 → 본문 읽기 → 실제 값 검사 흐름을 비교하는 실습 함수.
export async function getPopularMoviesWithFetch(page = 1, signal?: AbortSignal) {
  checkTmdbConfiguration();
  const url = new URL(`${tmdbBaseUrl}/movie/popular`);
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", String(page));
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${(import.meta.env.VITE_TMDB_TOKEN || "").trim()}` },
    signal,
  });
  if (!response.ok) {
    throw new Error(`영화 목록 요청 실패: ${response.status}`);
  }
  const data: unknown = await response.json();
  return toMoviePage(data);
}
