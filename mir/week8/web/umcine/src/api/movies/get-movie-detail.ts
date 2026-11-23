import { queryOptions } from "@tanstack/react-query";
import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

function getMovieDetailQueryOptions(movieId: number) {
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });
}

export {
  getMovieDetail,
  getMovieDetailQueryOptions,
  type GetMovieDetailResponse,
};
