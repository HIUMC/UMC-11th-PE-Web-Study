import { env } from "../../config/env";

const FALLBACK_POSTER = "/icons/movie.svg";

export function getTmdbImageUrl(path: string | null, size = "w500") {
  return path ? `${env.tmdbImageBaseUrl}/${size}${path}` : FALLBACK_POSTER;
}
