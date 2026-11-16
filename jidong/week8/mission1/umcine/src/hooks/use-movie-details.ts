import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../api/movies/models";
import { queryKeys } from "./query-keys";

const THIRTY_SECONDS = 30 * 1000;

// 즐겨찾기·평점에는 영화 ID만 있어서 제목과 포스터를 TMDB 상세로 채움
// 상세 페이지와 같은 key를 써서 이미 본 영화는 다시 요청하지 않음
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
