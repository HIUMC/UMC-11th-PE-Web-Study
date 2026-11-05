import { queryOptions } from "@tanstack/react-query";
import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface GetMoviesRequest {
  page?: number;
}

type GetMoviesResponse = TmdbMovieListResponse;

function getMovies({ page = 1 }: GetMoviesRequest = {}) {
  return tmdbClient
    .get("movie/popular", {
      searchParams: { language: "ko-KR", page },
    })
    .json<GetMoviesResponse>();
}

function getMoviesQueryOptions({ page = 1 }: GetMoviesRequest = {}) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

export {
  getMovies,
  getMoviesQueryOptions,
  type GetMoviesRequest,
  type GetMoviesResponse,
};
