import type { TmdbMovieListItem } from "../../api/movies/models";
import type { MovieCardItem } from "../../types/movie-card";
import { getTmdbPosterUrl } from "./tmdb-image";

export function toMovieCardItem(movie: TmdbMovieListItem): MovieCardItem {
  return {
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date.replaceAll("-", "."),
    posterUrl: getTmdbPosterUrl(movie.poster_path),
  };
}
