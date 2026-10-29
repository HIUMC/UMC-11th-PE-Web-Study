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
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

fetchPopularMovies()
  .then(({ results }) => {
    console.table(
      results.map(({ id, title, release_date, vote_average }) => ({
        id,
        title,
        releaseDate: release_date,
        rating: vote_average,
      })),
    );
  })
  .catch((error: unknown) => {
    console.error("인기 영화를 불러오지 못했어요.", error);
  });

export { fetchPopularMovies };