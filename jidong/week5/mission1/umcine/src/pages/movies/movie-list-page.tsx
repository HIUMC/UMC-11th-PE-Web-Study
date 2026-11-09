import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import { MovieGridSkeleton } from "../../components/movies/movie-grid-skeleton";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  // 첫 렌더링부터 요청이 시작되므로 로딩 상태로 시작해요.
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getMovies({ page: 1 })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    // 화면을 떠난 뒤 늦게 도착한 응답이 상태를 바꾸지 못하게 해요.
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>

      {isLoading ? (
        <div aria-busy="true">
          <p className="mb-4 text-sm text-gray-500">
            영화 목록을 불러오는 중이에요.
          </p>
          <MovieGridSkeleton />
        </div>
      ) : errorMessage ? (
        <p role="alert" className="py-16 text-center text-red-500">
          {errorMessage}
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          {movies.length > 0 && <Pagination />}
        </>
      )}
    </main>
  );
}
