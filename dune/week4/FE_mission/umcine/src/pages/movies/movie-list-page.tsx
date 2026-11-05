import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movie-grid";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  // 현재 페이지 번호만 직접 관리
  const [page, setPage] = useState(1);

  // 영화 데이터, 로딩 상태, 오류 상태는 useQuery가 관리
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
    <main className="main">
      <h1>영화 목록</h1>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />

          <div>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              이전
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}
    </main>
  );
}