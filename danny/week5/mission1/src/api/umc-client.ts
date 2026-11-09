import ky from "ky";

// 5주차에 만든 Spring 서버. 다른 주소로 띄웠다면 .env.local에 VITE_API_BASE_URL을 넣어 주세요.
export const umcClient = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { accept: "application/json" },
  timeout: 10_000,
  retry: 0,
});
