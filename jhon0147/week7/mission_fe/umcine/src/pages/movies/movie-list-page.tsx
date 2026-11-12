import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getRequestErrorMessage } from "../../api/tmdb";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestState } from "../../components/movies/request-state";
import { QueryFeedback } from "../../components/movies/query-feedback";
import { movieListOptions } from "../../queries/movie-queries";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const moviesQuery = useQuery(movieListOptions(page));
  const result = moviesQuery.data;
  const retry = () => { void moviesQuery.refetch(); };

  return (
    <main className="flex-1 bg-[#f6f8fb] px-4 pt-8 pb-18 sm:px-6">
      <section className="mx-auto max-w-320" aria-labelledby="movie-list-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900" id="movie-list-title">인기 영화</h1>
          {result && <p className="text-sm text-slate-500">{result.page}페이지 · 총 {result.totalResults.toLocaleString()}편</p>}
        </div>
        {moviesQuery.isPending ? (
          <RequestState message={moviesQuery.fetchStatus === "paused" ? "인터넷 연결을 기다리고 있어요." : "영화 목록을 불러오는 중..."} loading={moviesQuery.isFetching} />
        ) : moviesQuery.isError && !result ? (
          <RequestState message={getRequestErrorMessage(moviesQuery.error)} onRetry={retry} />
        ) : !result || result.results.length === 0 ? (
          <>
            <QueryFeedback isFetching={moviesQuery.isFetching} error={moviesQuery.error} onRetry={retry} />
            <RequestState message="표시할 영화가 없습니다." />
          </>
        ) : (
          <>
            <QueryFeedback isFetching={moviesQuery.isFetching} error={moviesQuery.error} onRetry={retry} />
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
