import type { TmdbMovie, TmdbMovieDetail } from "../../api/movies/models";
import type { MovieCardData, MovieDetailData } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

export function toMovieCard(movie: TmdbMovie): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview || "줄거리 정보가 없어요.",
  };
}

export function toMovieDetail(movie: TmdbMovieDetail): MovieDetailData {
  const minutes = movie.runtime;
  const runtime = typeof minutes === "number"
    ? minutes >= 60
      ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
      : `${minutes}분`
    : "상영 시간 정보가 없어요.";

  return {
    ...toMovieCard(movie),
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path),
    genres: movie.genres.map((genre) => genre.name),
    runtime,
    tagline: movie.tagline || "줄거리",
  };
}
