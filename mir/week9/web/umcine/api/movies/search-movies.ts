import { queryOptions } from "@tanstack/react-query";
import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest {
  query: string;
  page?: number;
}

type SearchMoviesResponse = TmdbMovieListResponse;

function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return tmdbClient
    .get("search/movie", {
      searchParams: {
        query,
        language: "ko-KR",
        include_adult: false,
        page,
      },
    })
    .json<SearchMoviesResponse>();
}

function searchMoviesQueryOptions({ query, page = 1 }: SearchMoviesRequest) {
  const normalizedQuery = query.trim();

  return queryOptions({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery, page }),
    enabled: normalizedQuery.length > 0,
  });
}

export {
  searchMovies,
  searchMoviesQueryOptions,
  type SearchMoviesRequest,
  type SearchMoviesResponse,
};
