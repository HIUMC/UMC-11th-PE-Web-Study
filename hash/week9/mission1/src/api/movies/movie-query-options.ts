import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

export const movieQueryOptions = {
  list: (page = 1) =>
    queryOptions({
      queryKey: ["movies", "list", { page }] as const,
      queryFn: ({ signal }) => getMovies({ page, signal }),
    }),

  search: (query: string, page = 1) => {
    const normalizedQuery = query.trim();

    return queryOptions({
      queryKey: ["movies", "search", { query: normalizedQuery, page }] as const,
      queryFn: ({ signal }) =>
        searchMovies({ query: normalizedQuery, page, signal }),
      enabled: normalizedQuery.length > 0,
    });
  },

  detail: (movieId: number) => {
    const isValidMovieId = Number.isSafeInteger(movieId) && movieId > 0;

    return queryOptions({
      queryKey: ["movies", "detail", isValidMovieId ? movieId : null] as const,
      queryFn: ({ signal }) => getMovieDetail(movieId, signal),
      enabled: isValidMovieId,
      staleTime: 30 * 1000,
    });
  },
};
