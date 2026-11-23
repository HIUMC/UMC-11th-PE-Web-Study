import type { KyInstance } from "ky";
import { toMovie, toMoviePage } from "./movie-mappers.ts";

export function createMovieService(
  client: KyInstance,
  baseUrl: string,
  checkConfiguration: () => void = () => {},
) {
  const base = baseUrl.replace(/\/+$/, "");
  return {
    async getPopularMovies(page = 1, signal?: AbortSignal) {
      checkConfiguration();
      const data = await client.get(`${base}/movie/popular`, {
        searchParams: { language: "ko-KR", page },
        signal,
      }).json<unknown>();
      return toMoviePage(data);
    },
    async searchMovies(query: string, page = 1, signal?: AbortSignal) {
      const keyword = query.trim();
      if (!keyword) {
        return { page: 1, results: [], totalPages: 0, totalResults: 0 };
      }
      checkConfiguration();
      const data = await client.get(`${base}/search/movie`, {
        searchParams: { language: "ko-KR", query: keyword, page, include_adult: false },
        signal,
      }).json<unknown>();
      return toMoviePage(data);
    },
    async getMovieDetails(movieId: number, signal?: AbortSignal) {
      if (!Number.isSafeInteger(movieId) || movieId <= 0) {
        throw new Error("올바른 영화 번호를 입력해 주세요.");
      }
      checkConfiguration();
      const data = await client.get(`${base}/movie/${movieId}`, {
        searchParams: { language: "ko-KR" },
        signal,
      }).json<unknown>();
      return toMovie(data);
    },
  };
}
