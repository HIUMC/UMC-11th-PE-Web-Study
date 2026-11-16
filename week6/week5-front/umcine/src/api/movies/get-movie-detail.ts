import { tmdbGet } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

export function getMovieDetail(movieId: number) {
  return tmdbGet<TmdbMovieDetail>(`/movie/${movieId}`);
}
