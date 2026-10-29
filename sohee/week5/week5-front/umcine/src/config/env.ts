export const env = {
  tmdbBaseUrl: "https://api.themoviedb.org/3",
  tmdbImageBaseUrl: "https://image.tmdb.org/t/p",
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined,
};
