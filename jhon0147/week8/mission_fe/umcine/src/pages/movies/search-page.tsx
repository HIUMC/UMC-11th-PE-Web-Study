import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequestErrorMessage } from "../../api/tmdb";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestState } from "../../components/movies/request-state";
import { QueryFeedback } from "../../components/movies/query-feedback";
import { movieSearchOptions } from "../../queries/movie-queries";

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: "/search" });
  return <SearchContent key={query ?? ""} query={query} page={page} />;
}

function SearchContent({ query, page }: { query?: string; page: number }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const keyword = query?.trim() ?? "";
  const searchQuery = useQuery({
    ...movieSearchOptions(keyword, page),
    enabled: keyword.length > 0,
  });
  const result = searchQuery.data;
  const retry = () => { void searchQuery.refetch(); };

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
              {searchQuery.isPending ? (
                <RequestState message={searchQuery.isLoading ? "검색 결과를 불러오는 중..." : "인터넷 연결을 기다리고 있어요."} loading={searchQuery.isLoading} />
              ) : searchQuery.isError && !result ? (
                <RequestState message={getRequestErrorMessage(searchQuery.error)} onRetry={retry} />
              ) : !result || result.results.length === 0 ? (
                <>
                  <QueryFeedback isFetching={searchQuery.isFetching} error={searchQuery.error} onRetry={retry} />
                  <RequestState message="검색 결과가 없어요. 다른 검색어를 입력해 주세요." />
                </>
              ) : (
                <>
                  <QueryFeedback isFetching={searchQuery.isFetching} error={searchQuery.error} onRetry={retry} />
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
