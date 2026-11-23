// 서버에서만 읽는 값입니다. NEXT_PUBLIC_ 접두사가 없으므로 클라이언트 번들에 포함되지 않습니다.
// TMDB 토큰을 여기로 옮겨서, Vite 시절과 달리 브라우저에 노출되지 않습니다.
const tmdbApiBaseUrl = process.env.TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB_API_BASE_URL, TMDB_ACCESS_TOKEN 환경 변수가 필요해요.");
}

export const serverEnv = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
