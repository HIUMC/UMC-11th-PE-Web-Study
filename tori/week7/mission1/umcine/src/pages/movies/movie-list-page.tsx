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
    setPage(nextPage);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[1280px] flex-1 pb-24 pt-6">
        <h1 className="mb-5 text-[32px] font-bold tracking-tight">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p className="py-16 text-center text-text-sub">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : moviesQuery.isError ? (
          <p className="py-16 text-center text-text-sub">
            영화 목록을 불러오지 못했어요.
          </p>
        ) : movies.length === 0 ? (
          <p className="py-16 text-center text-text-sub">
            조건에 맞는 영화가 없어요.
          </p>
        ) : (
          <>
            <MovieGrid movies={movies} />

            {/* 페이지네이션 */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                이전
              </button>

              <span className="text-sm">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border bg-surface">
        <p className="mx-auto max-w-[1280px] py-5 text-right text-xs text-text-sub">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="underline"
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
}