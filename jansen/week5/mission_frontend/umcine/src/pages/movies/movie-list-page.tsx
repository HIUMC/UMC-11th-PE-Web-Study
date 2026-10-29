import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

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
    <main className="px-20 pb-10 pt-8 max-[560px]:px-5">
      <h1 className="mb-6 text-[32px] font-bold text-ink">영화 목록</h1>

      {isLoading ? (
        <p className="text-muted">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="text-muted">{errorMessage}</p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination />
    </main>
  );
}