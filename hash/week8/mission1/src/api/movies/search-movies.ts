import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest {
  query: string;
  page?: number;
  signal?: AbortSignal;
}

type SearchMoviesResponse = TmdbMovieListResponse;

function searchMovies({ query, page = 1, signal }: SearchMoviesRequest) {
  return tmdbClient
    .get("search/movie", {
      signal,
      searchParams: {
        query,
        language: "ko-KR",
        include_adult: false,
        page,
      },
    })
    .json<SearchMoviesResponse>();
}

export {
  searchMovies,
  type SearchMoviesRequest,
  type SearchMoviesResponse,
};
