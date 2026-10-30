import { tmdbClient } from "../tmdb-client";
import { HTTPError } from "ky";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

async function getMovieDetail(movieId: number, signal?: AbortSignal) {
  try {
    return await tmdbClient
    .get(`movie/${movieId}`, {
      signal,
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return null;
    throw error;
  }
}

export { getMovieDetail, type GetMovieDetailResponse };
