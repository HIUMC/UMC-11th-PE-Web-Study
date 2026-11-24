import "server-only";

export function getTmdbEnv() {
  const tmdbApiBaseUrl =
    process.env.TMDB_API_BASE_URL ??
    process.env.VITE_TMDB_API_BASE_URL ??
    "https://api.themoviedb.org/3";
  const tmdbAccessToken =
    process.env.TMDB_ACCESS_TOKEN ?? process.env.VITE_TMDB_ACCESS_TOKEN;

  if (!tmdbAccessToken) {
    throw new Error("TMDB 환경 변수가 필요해요.");
  }

  return { tmdbApiBaseUrl: tmdbApiBaseUrl.replace(/\/+$/, ""), tmdbAccessToken };
}
