import ky from "ky";

// 영화 API(TMDB)와 회원/평점 API(Spring)는 서로 다른 서버다.
export const backendClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "")}/`,
  timeout: 10000,
  retry: 0,
});
