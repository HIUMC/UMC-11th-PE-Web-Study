//query key, request function, cache 설정
import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

export function movieListQueryOptions(page: number) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

export function movieSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["movies", "search", { query }],
    queryFn: () => searchMovies({ query }),
    enabled: query.length > 0,
  });
}

export function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isInteger(movieId) && movieId > 0,
    staleTime: 30 * 1000,
  });
}