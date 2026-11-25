import type { TmdbMovie } from "../../api/movies/models";
import type { MovieCardItem } from "../../types/movie-card";
import { getTmdbPosterUrl } from "./tmdb-image";

// 목록 응답과 상세 응답 모두 TmdbMovie를 포함하므로 둘 다 변환할 수 있음
export function toMovieCardItem(movie: TmdbMovie): MovieCardItem {
  return {
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date.replaceAll("-", "."),
    posterUrl: getTmdbPosterUrl(movie.poster_path),
  };
}
