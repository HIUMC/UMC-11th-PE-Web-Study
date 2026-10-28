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
    return () => { ignore = true; };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-9 lg:px-12 lg:py-10">
      <h1 className="mb-6 text-4xl font-bold tracking-[-0.04em]">영화 목록</h1>
      {isLoading ? (
        <p role="status" className="py-24 text-center text-slate-500">불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert" className="py-24 text-center text-slate-500">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-24 text-center text-slate-500">조건에 맞는 영화가 없어요.</p>
      ) : <MovieGrid movies={movies} />}
    </main>
  );
}
