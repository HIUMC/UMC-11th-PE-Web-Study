import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState, type SubmitEvent } from "react";
import { movieService } from "../../api/tmdb";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestState } from "../../components/movies/request-state";
import { useMovieRequest } from "../../hooks/use-movie-request";

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: "/search" });
  return <SearchContent key={query ?? ""} query={query} page={page} />;
}

function SearchContent({ query, page }: { query?: string; page: number }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const keyword = query?.trim() ?? "";
  const load = useCallback(
    (signal: AbortSignal) => movieService.searchMovies(keyword, page, signal),
    [keyword, page],
  );
  const request = useMovieRequest(`search:${keyword}:${page}`, load, Boolean(keyword));
  const result = request.data;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="flex-1 bg-[#f6f8fb] px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto max-w-320" aria-labelledby="search-title">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-blue-600">UMCine Search</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl" id="search-title">영화 검색</h1>
          <form className="relative mt-7" onSubmit={handleSubmit}>
            <img className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 opacity-45" src="/icons/search.svg" alt="" />
            <input className="h-13 w-full rounded-xl border border-slate-200 bg-white pr-24 pl-12 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              aria-label="검색어" placeholder="영화 제목을 입력하세요" value={searchText}
              onChange={(event) => setSearchText(event.target.value)} />
            <button className="absolute top-1.5 right-1.5 h-10 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-blue-200" type="submit">검색</button>
          </form>
        </div>
        <div className="mt-12">
          {!keyword ? <RequestState message="검색어를 입력해 주세요." /> : (
            <>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">‘{keyword}’ 검색 결과</h2>
                {result && <p className="text-sm text-slate-500">영화 {result.totalResults.toLocaleString()}편 · {result.page}페이지</p>}
              </div>
              {request.status === "loading" ? (
                <RequestState message="검색 결과를 불러오는 중..." loading />
              ) : request.status === "error" ? (
                <RequestState message={request.error} onRetry={request.retry} />
              ) : !result || result.results.length === 0 ? (
                <RequestState message="검색 결과가 없어요. 다른 검색어를 입력해 주세요." />
              ) : (
                <>
                  <MovieGrid movies={result.results} />
                  <Pagination currentPage={page} totalPages={Math.min(result.totalPages, 500)}
                    onPageChange={(nextPage) => {
                      navigate({ search: { query: keyword, ...(nextPage > 1 ? { page: nextPage } : {}) } });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} />
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
