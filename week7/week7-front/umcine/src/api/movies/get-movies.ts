import { tmdbGet } from "../tmdb-client";
import type { TmdbMovieListItem, TmdbPaginatedResponse } from "./models";

interface GetMoviesParams {
  page?: number;
}

export function getMovies({ page = 1 }: GetMoviesParams = {}) {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>("/movie/popular", { page });
}
