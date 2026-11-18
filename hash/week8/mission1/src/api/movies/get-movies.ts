import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface GetMoviesRequest {
  page?: number;
  signal?: AbortSignal;
}

type GetMoviesResponse = TmdbMovieListResponse;

function getMovies({ page = 1, signal }: GetMoviesRequest = {}) {
  return tmdbClient
    .get("movie/popular", {
      searchParams: { language: "ko-KR", page },
      signal,
    })
    .json<GetMoviesResponse>();
}

export { getMovies, type GetMoviesRequest, type GetMoviesResponse };
