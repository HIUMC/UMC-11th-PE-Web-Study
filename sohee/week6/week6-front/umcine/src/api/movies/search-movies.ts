import { tmdbGet } from "../tmdb-client";
import type { TmdbMovieListItem, TmdbPaginatedResponse } from "./models";

interface SearchMoviesParams {
  query: string;
  page?: number;
}

export function searchMovies({ query, page = 1 }: SearchMoviesParams) {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>("/search/movie", { query, page });
}
