// Next.js는 NEXT_PUBLIC_ 접두사가 붙은 변수만 브라우저 코드에 넣어준다.
// 빌드할 때 process.env.NEXT_PUBLIC_XXX 문자열을 값으로 치환하므로, 반드시 이 형태 그대로 적어야 한다.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
