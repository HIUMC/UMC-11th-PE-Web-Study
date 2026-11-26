import "server-only";
import { toMovie } from "../../api/movie-mappers";
import { createTmdbRequest } from "../../api/tmdb-request";

export const requestTmdb = createTmdbRequest({
  baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  token: process.env.TMDB_TOKEN || "",
});

export async function getServerMovie(movieId: number) {
  const response = await requestTmdb(`movie/${movieId}`);
  if (!response.ok) throw new Error(`영화 상세 요청 실패: ${response.status}`);
  return toMovie(await response.json());
}
