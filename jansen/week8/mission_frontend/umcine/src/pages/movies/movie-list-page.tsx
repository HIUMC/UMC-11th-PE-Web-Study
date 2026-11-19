import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];

  return (
    <main className="px-20 pb-10 pt-8 max-[560px]:px-5">
      <h1 className="mb-6 text-[32px] font-bold text-ink">영화 목록</h1>

      {moviesQuery.isPending ? (
        <p className="text-muted">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="text-muted">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="text-muted">표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination currentPage={page} onPageChange={setPage} />
    </main>
  );
}