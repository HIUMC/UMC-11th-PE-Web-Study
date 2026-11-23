// 브라우저에서도 쓰는 값입니다. NEXT_PUBLIC_ 접두사가 붙은 것만 클라이언트 번들에 들어갑니다.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요해요.");
}

export const env = {
  apiBaseUrl,
};
