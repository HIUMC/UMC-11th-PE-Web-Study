import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movieService } from "../../api/tmdb";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestState } from "../../components/movies/request-state";
import { useMovieRequest } from "../../hooks/use-movie-request";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const load = useCallback(
    (signal: AbortSignal) => movieService.getPopularMovies(page, signal), [page],
  );
  const request = useMovieRequest(`popular:${page}`, load);
  const result = request.data;

  return (
    <main className="flex-1 bg-[#f6f8fb] px-4 pt-8 pb-18 sm:px-6">
      <section className="mx-auto max-w-320" aria-labelledby="movie-list-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900" id="movie-list-title">인기 영화</h1>
          {result && <p className="text-sm text-slate-500">{result.page}페이지 · 총 {result.totalResults.toLocaleString()}편</p>}
        </div>
        {request.status === "loading" ? (
          <RequestState message="영화 목록을 불러오는 중..." loading />
        ) : request.status === "error" ? (
          <RequestState message={request.error} onRetry={request.retry} />
        ) : !result || result.results.length === 0 ? (
          <RequestState message="표시할 영화가 없습니다." />
        ) : (
          <>
            <MovieGrid movies={result.results} />
            <Pagination currentPage={page} totalPages={Math.min(result.totalPages, 500)}
              onPageChange={(nextPage) => {
                navigate({ search: nextPage === 1 ? {} : { page: nextPage } });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} />
          </>
        )}
      </section>
    </main>
  );
}
