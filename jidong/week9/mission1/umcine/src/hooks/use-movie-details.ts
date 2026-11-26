import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../api/movies/models";
import { queryKeys } from "./query-keys";

const THIRTY_SECONDS = 30 * 1000;

export function useMovieDetails(movieIds: number[]) {
  const results = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: queryKeys.movieDetail(movieId),
      queryFn: () => getMovieDetail(movieId),
      staleTime: THIRTY_SECONDS,
    })),
  });

  const movies = new Map<number, TmdbMovieDetail>();
  results.forEach((result, index) => {
    if (result.data) movies.set(movieIds[index], result.data);
  });
  return movies;
}
