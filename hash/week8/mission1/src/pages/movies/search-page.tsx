import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movieQueryOptions } from "../../api/movies/movie-query-options";
import SearchForm from "../../components/movies/search-form";
import SearchResultCard from "../../components/movies/search-result-card";
import Pagination from "../../components/movies/pagination";
import RequestMessage from "../../components/movies/request-message";
import QueryStatusNotice from "../../components/movies/query-status-notice";
import { toMovieCard } from "../../utils/movies/movie-adapter";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const normalizedQuery = query.trim();
  const navigate = useNavigate({ from: "/search" });
  const searchQuery = useQuery(movieQueryOptions.search(normalizedQuery, page));
  const response = searchQuery.data;

  function retry() {
    void searchQuery.refetch();
  }

  if (!normalizedQuery) {
    return (
      <main className="flex-1 bg-[#f5f6f8]">
        <div className="mx-auto max-w-[840px] px-6 pb-24 pt-24 sm:pt-36">
          <h1 className="mb-8 text-center text-2xl font-extrabold tracking-tight sm:text-[32px]">
            어떤 영화를 찾고 있나요?
          </h1>
          <SearchForm key={query} initialQuery={query} />
          <p className="mt-5 text-center text-sm text-[#8a909b]">검색어를 입력해 주세요.</p>
        </div>
      </main>
    );
  }

  const movies = response?.results.map(toMovieCard) ?? [];

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-[32px]">영화 검색</h1>
        <SearchForm key={normalizedQuery} initialQuery={normalizedQuery} buttonLabel="다시 검색" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e7ee] pb-4">
          <h2 className="min-w-0 break-words text-base font-bold">‘{query}’ 검색 결과</h2>
          {response && (
            <p aria-live="polite" className="shrink-0 text-xs text-[#8a909b]">
              영화 {response.total_results.toLocaleString()}편 · {page}페이지
            </p>
          )}
        </div>
        {response && (
          <QueryStatusNotice
            isFetching={searchQuery.isFetching}
            isPaused={searchQuery.isPaused}
            hasError={searchQuery.isError}
            onRetry={retry}
          />
        )}
        {searchQuery.isLoading ? (
          <RequestMessage message="검색 결과를 불러오는 중이에요." />
        ) : searchQuery.isPaused && !response ? (
          <RequestMessage message="네트워크 연결을 기다리고 있어요." />
        ) : searchQuery.isError && !response ? (
          <RequestMessage message="검색 결과를 불러오지 못했어요." isError onRetry={retry} />
        ) : movies.length === 0 ? (
          <RequestMessage message="검색 결과가 없어요. 다른 제목으로 검색해 보세요." />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {movies.map((movie) => <SearchResultCard key={movie.id} movie={movie} />)}
          </div>
        )}
        {response && response.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={response.total_pages}
            onPageChange={(nextPage) => {
              void navigate({
                to: "/search",
                search: { query, page: nextPage > 1 ? nextPage : undefined },
              });
            }}
          />
        )}
      </div>
    </main>
  );
}
