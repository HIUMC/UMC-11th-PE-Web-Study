import { MAX_TMDB_PAGE } from "../api/movie-adapter";

export function parsePageParam(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page > 1
    ? Math.min(page, MAX_TMDB_PAGE)
    : undefined;
}
