import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => {
    console.log("TMDB 응답:", response);
    console.table(
      response.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
      })),
    );
  })
  .catch((error: unknown) => {
    console.error("TMDB 요청 실패:", error);
  });
