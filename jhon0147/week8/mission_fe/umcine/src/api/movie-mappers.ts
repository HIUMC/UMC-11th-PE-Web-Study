import type { Movie, MoviePage } from "../types/movie";

const IMAGE_BASE = "https://image.tmdb.org/t/p";
const PLACEHOLDER = "/images/poster-placeholder.svg";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("서버 응답의 데이터 형식이 올바르지 않습니다.");
  }
  return value as Record<string, unknown>;
}

function integer(value: unknown, name: string, minimum = 0): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) {
    throw new Error(`${name} 값이 올바르지 않습니다.`);
  }
  return value;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function toImageUrl(path: unknown, size = "w500"): string {
  return typeof path === "string" && /^\/[^/]/.test(path)
    ? `${IMAGE_BASE}/${size}${path}`
    : PLACEHOLDER;
}

export function toMovie(value: unknown): Movie {
  const movie = record(value);
  const id = integer(movie.id, "영화 ID", 1);
  if (typeof movie.title !== "string" || !movie.title.trim()) {
    throw new Error("영화 제목이 올바르지 않습니다.");
  }
  const minutes = typeof movie.runtime === "number" && movie.runtime > 0
    ? Math.round(movie.runtime) : 0;
  const genres = Array.isArray(movie.genres)
    ? movie.genres.flatMap((genre) => {
        if (!genre || typeof genre !== "object") return [];
        const name = (genre as Record<string, unknown>).name;
        return typeof name === "string" ? [name] : [];
      })
    : [];
  return {
    id,
    title: movie.title,
    originalTitle: text(movie.original_title, movie.title),
    releaseDate: text(movie.release_date, "개봉일 미정"),
    posterPath: toImageUrl(movie.poster_path),
    backdropPath: toImageUrl(movie.backdrop_path, "w1280"),
    genres,
    runtime: minutes ? `${minutes}분` : "상영 시간 정보 없음",
    tagline: text(movie.tagline, movie.title),
    overview: text(movie.overview, "등록된 줄거리가 없습니다."),
    voteAverage: typeof movie.vote_average === "number" && Number.isFinite(movie.vote_average)
      ? movie.vote_average : 0,
  };
}

export function toMoviePage(value: unknown): MoviePage {
  const page = record(value);
  if (!Array.isArray(page.results)) {
    throw new Error("영화 목록이 배열이 아닙니다.");
  }
  return {
    page: integer(page.page, "페이지", 1),
    results: page.results.map(toMovie),
    totalPages: integer(page.total_pages, "전체 페이지"),
    totalResults: integer(page.total_results, "전체 결과 수"),
  };
}
