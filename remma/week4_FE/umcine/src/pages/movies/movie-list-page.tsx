import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-950">영화 목록</h1>

      {isLoading ? (
        <p className="py-12 text-center text-gray-500">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="py-12 text-center text-red-600">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </main>
  );
}

export default MovieListPage;