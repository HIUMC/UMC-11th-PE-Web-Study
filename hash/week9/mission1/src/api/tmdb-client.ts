import ky from "ky";

export const tmdbClient = ky.create({
  baseUrl: "/api/tmdb/",
  // 자동 재시도는 TanStack Query 한 곳에서 관리한다.
  retry: 0,
});
