import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../utils/cn";


const PAGE_GROUP_SIZE = 5;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  // 현재 페이지가 속한 5개 단위의 페이지 번호 목록 계산 (예: 1~5, 6~10)
  const startPage =
    Math.floor((page - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-extrabold text-gray-950">영화 목록</h1>
      {moviesQuery.isPending ? (
        <p className="py-12 text-center text-gray-500">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-12 text-center text-red-600">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                &lt;
              </button>
            )}

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-semibold transition-colors",
                  pageNumber === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                )}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default MovieListPage;