import { useState, useEffect } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

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
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">
        영화 목록
      </h1>
      {isLoading ? (
        <p className="py-20 text-center text-neutral-500">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="py-20 text-center text-red-600">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-neutral-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination />
        </>

      )}
    </main>
  );
}