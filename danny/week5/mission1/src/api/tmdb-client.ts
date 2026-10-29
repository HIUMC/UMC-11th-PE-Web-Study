import ky from "ky";

export const tmdbClient = ky.create({
  prefix: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
  searchParams: { language: "ko-KR" },
  timeout: 10_000,
  retry: 0,
});
