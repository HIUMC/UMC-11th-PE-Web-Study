import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface GetMoviesRequest {
  page?: number;
}

type GetMoviesResponse = TmdbMovieListResponse;

function getMovies({ page = 1 }: GetMoviesRequest = {}, signal?: AbortSignal) {
  return tmdbClient
    .get("movie/popular", {
      signal,
      searchParams: { language: "ko-KR", page },
    })
    .json<GetMoviesResponse>();
}

export { getMovies, type GetMoviesRequest, type GetMoviesResponse };
