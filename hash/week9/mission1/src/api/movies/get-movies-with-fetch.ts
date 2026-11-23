import type { TmdbMovieListResponse } from "./models";

export async function getMoviesWithFetch(page = 1): Promise<TmdbMovieListResponse> {
  const response = await fetch(`/api/tmdb/movie/popular?page=${page}`);

  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}
