import type { TmdbMovieListResponse } from "./models";

export async function fetchMovieResults(
  path: "/api/movies" | "/api/movies/search",
  params: Record<string, string>,
  signal: AbortSignal,
): Promise<TmdbMovieListResponse> {
  const response = await fetch(`${path}?${new URLSearchParams(params)}`, { signal });

  if (!response.ok) {
    throw new Error(`영화 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}
