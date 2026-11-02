import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-9 lg:px-12 lg:py-10">
      <h1 className="mb-6 text-4xl font-bold tracking-[-0.04em]">영화 목록</h1>
      {moviesQuery.isPending ? (
        <p role="status" className="py-24 text-center text-slate-500">
          불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p role="alert" className="py-24 text-center text-slate-500">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-24 text-center text-slate-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          {totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-4"
              aria-label="페이지 이동"
            >
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:text-slate-300"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                이전
              </button>
              <span aria-live="polite" className="text-sm font-semibold">
                {page} / {totalPages} 페이지
              </span>
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:text-slate-300"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                다음
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
