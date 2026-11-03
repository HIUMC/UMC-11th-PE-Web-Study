import ky from "ky";

export const umcClient = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { accept: "application/json" },
  timeout: 10_000,
  retry: 0,
});
