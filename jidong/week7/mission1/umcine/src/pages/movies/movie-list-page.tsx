import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import { MovieGridSkeleton } from "../../components/movies/movie-grid-skeleton";
import Pagination from "../../components/movies/pagination";

// TMDB는 500페이지까지만 조회 가능함
const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    // page를 key에 넣어서 페이지별로 따로 캐시함
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, TMDB_MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>

      {moviesQuery.isPending ? (
        <div aria-busy="true">
          <p className="mb-4 text-sm text-gray-500">
            영화 목록을 불러오는 중이에요.
          </p>
          <MovieGridSkeleton />
        </div>
      ) : moviesQuery.isError ? (
        <p role="alert" className="py-16 text-center text-red-500">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          {movies.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}
