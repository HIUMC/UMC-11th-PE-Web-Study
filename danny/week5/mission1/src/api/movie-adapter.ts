import type { Movie, MoviePage, MovieSummary } from "../types/movie";
import type {
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbPagedResponse,
} from "../types/tmdb";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const MAX_TMDB_PAGE = 500;

function toImageUrl(path: string | null, size: "w500" | "w1280") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

function formatReleaseDate(releaseDate?: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 미정";
}

function formatRuntime(minutes: number | null) {
  if (!minutes) {
    return "";
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest}분`;
  }
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

export function toMovieSummary(item: TmdbMovieListItem): MovieSummary {
  return {
    id: item.id,
    title: item.title,
    originalTitle: item.original_title,
    releaseDate: formatReleaseDate(item.release_date),
    posterPath: toImageUrl(item.poster_path, "w500"),
    backdropPath: toImageUrl(item.backdrop_path, "w1280"),
    overview: item.overview,
  };
}

export function toMovie(detail: TmdbMovieDetail): Movie {
  return {
    ...toMovieSummary(detail),
    genres: detail.genres.map((genre) => genre.name),
    runtime: formatRuntime(detail.runtime),
    tagline: detail.tagline ?? "",
  };
}

export function toMoviePage(
  response: TmdbPagedResponse<TmdbMovieListItem>,
): MoviePage {
  return {
    movies: response.results.map(toMovieSummary),
    page: response.page,
    totalPages: Math.min(response.total_pages, MAX_TMDB_PAGE),
    totalResults: response.total_results,
  };
}
