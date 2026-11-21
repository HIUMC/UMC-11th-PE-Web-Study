import type { Movie } from "../../types/movie";
import type { TmdbMovieListItem } from "./models";

// API 데이터 → 기존 영화 카드의 UI 타입
export function toMovie(movie: TmdbMovieListItem, isBookmarked = false): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked,
  };
}
