import { queryOptions } from "@tanstack/react-query";
import { movieService } from "../api/tmdb";

export function movieListOptions(page: number) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: ({ signal }) => movieService.getPopularMovies(page, signal),
  });
}

export function movieSearchOptions(query: string, page: number) {
  const keyword = query.trim();
  return queryOptions({
    queryKey: ["movies", "search", { query: keyword, page }],
    queryFn: ({ signal }) => movieService.searchMovies(keyword, page, signal),
  });
}

export function movieDetailOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: ({ signal }) => movieService.getMovieDetails(movieId, signal),
    staleTime: 30 * 1000,
  });
}
