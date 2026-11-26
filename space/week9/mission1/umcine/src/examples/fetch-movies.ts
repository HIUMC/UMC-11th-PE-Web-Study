import { env } from "../config/env";
import type { TmdbMovieListResponse } from "../api/movies/models";

async function fetchPopularMovies(
  page = 1,
): Promise<TmdbMovieListResponse> {
  const searchParams = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
  );

  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { fetchPopularMovies };
