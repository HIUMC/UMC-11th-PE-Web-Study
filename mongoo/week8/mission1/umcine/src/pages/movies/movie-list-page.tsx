import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

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
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="page-container pb-10 pt-5">
        <h1 className="mb-4 text-[28px] font-bold leading-[1.3] text-[#171717]">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p>영화를 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}