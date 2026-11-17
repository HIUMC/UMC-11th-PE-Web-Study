import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail, getPopularMovies, searchMovies } from "./movies-api";

export const movieKeys = {
  all: ["movies"] as const,
  popular: (page: number) => [...movieKeys.all, "popular", { page }] as const,
  search: (query: string, page: number) =>
    [...movieKeys.all, "search", { query, page }] as const,
  detail: (movieId: number) => [...movieKeys.all, "detail", movieId] as const,
};

export function popularMoviesQueryOptions(page: number) {
  return queryOptions({
    queryKey: movieKeys.popular(page),
    queryFn: ({ signal }) => getPopularMovies(page, signal),
  });
}

export function searchMoviesQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: movieKeys.search(query, page),
    queryFn: ({ signal }) => searchMovies(query, page, signal),
  });
}

export function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: movieKeys.detail(movieId),
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
  });
}
