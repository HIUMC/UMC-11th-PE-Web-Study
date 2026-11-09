import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
    staleTime: 30 * 1000,
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">
        영화 목록
      </h1>
      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-neutral-500">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="py-20 text-center text-red-600">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-neutral-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </main>
  );
}