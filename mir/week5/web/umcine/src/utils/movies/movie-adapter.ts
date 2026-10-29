import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

export function toMovie(item: TmdbMovieListItem): Movie {
  return {
    id: item.id,
    title: item.title,
    originalTitle: item.original_title,
    releaseDate: item.release_date,
    posterPath: getTmdbPosterUrl(item.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(item.backdrop_path) ?? "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: item.overview,
    isBookmarked: false,
  };
}
