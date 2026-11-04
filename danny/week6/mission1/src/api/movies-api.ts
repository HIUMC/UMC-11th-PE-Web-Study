import type {
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbPagedResponse,
} from "../types/tmdb";
import { toMovie, toMoviePage } from "./movie-adapter";
import { tmdbClient } from "./tmdb-client";

export async function getPopularMovies(page: number, signal?: AbortSignal) {
  const data = await tmdbClient
    .get("movie/popular", { searchParams: { page }, signal })
    .json<TmdbPagedResponse<TmdbMovieListItem>>();
  return toMoviePage(data);
}

export async function searchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
) {
  const data = await tmdbClient
    .get("search/movie", {
      searchParams: { query, page, include_adult: false },
      signal,
    })
    .json<TmdbPagedResponse<TmdbMovieListItem>>();
  return toMoviePage(data);
}

export async function getMovieDetail(movieId: number, signal?: AbortSignal) {
  const data = await tmdbClient
    .get(`movie/${movieId}`, { signal })
    .json<TmdbMovieDetail>();
  return toMovie(data);
}
