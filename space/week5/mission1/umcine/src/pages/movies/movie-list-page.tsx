import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { getMoviesWithFetch } from "../../api/movies/get-movies-with-fetch";
import type { TmdbMovie } from "../../api/movies/models";
import type { Movie as MovieCardData } from "../../types/movie";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import "../../App.css";

function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        const response = await getMoviesWithFetch(1);
        if (ignore) return;

        setMovies(response.results);
      } catch (error) {
        console.error("영화 목록을 불러오지 못했어요.", error);
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const movieCards: MovieCardData[] = movies.flatMap((movie) => {
    if (!movie.poster_path) return [];

    return [
      {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        release_date: movie.release_date || "개봉일 미정",
        poster_path: getTmdbPosterUrl(movie.poster_path),
        backdrop_path: getTmdbBackdropUrl(movie.backdrop_path),
        genres: [],
        runtime: "",
        tagline: "",
        overview: movie.overview,
        isBookmarked: false,
      },
    ];
  });

  return (
    <main className="flex w-full flex-col items-start gap-5 px-4 py-6 sm:px-8 lg:px-20">
      <h1 className="text-3xl leading-tight font-bold tracking-tight text-text-primary sm:text-4xl">
        영화 목록
      </h1>
      {isLoading ? (
        <p className="text-sm text-text-secondary" role="status">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="text-sm text-text-secondary" role="alert">
          {errorMessage}
        </p>
      ) : movieCards.length > 0 ? (
        <MovieGrid movies={movieCards} />
      ) : (
        <p className="text-sm text-text-secondary">표시할 영화가 없어요.</p>
      )}
    </main>
  );
}

export default MovieListPage;
