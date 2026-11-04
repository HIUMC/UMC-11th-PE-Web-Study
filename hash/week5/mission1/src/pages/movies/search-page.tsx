import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { searchMovies } from "../../api/movies/search-movies";
import type { SearchMoviesResponse } from "../../api/movies/search-movies";
import SearchForm from "../../components/movies/search-form";
import SearchResultCard from "../../components/movies/search-result-card";
import Pagination from "../../components/movies/pagination";
import RequestMessage from "../../components/movies/request-message";
import { toMovieCard } from "../../utils/movies/movie-adapter";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const normalizedQuery = query.trim();

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

  return (
    <SearchResults
      key={JSON.stringify([normalizedQuery, page])}
      query={normalizedQuery}
      page={page}
    />
  );
}

function SearchResults({ query, page }: { query: string; page: number }) {
  const navigate = useNavigate({ from: "/search" });
  const [response, setResponse] = useState<SearchMoviesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    searchMovies({ query, page })
      .then((result) => { if (!ignore) setResponse(result); })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => { if (!ignore) setIsLoading(false); });

    return () => { ignore = true; };
  }, [query, page, attempt]);

  function retry() {
    setIsLoading(true);
    setErrorMessage(null);
    setAttempt((value) => value + 1);
  }

  const movies = response?.results.map(toMovieCard) ?? [];

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-[32px]">영화 검색</h1>
        <SearchForm initialQuery={query} buttonLabel="다시 검색" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e7ee] pb-4">
          <h2 className="min-w-0 break-words text-base font-bold">‘{query}’ 검색 결과</h2>
          {!isLoading && !errorMessage && response && (
            <p aria-live="polite" className="shrink-0 text-xs text-[#8a909b]">
              영화 {response.total_results.toLocaleString()}편 · {page}페이지
            </p>
          )}
        </div>
        {isLoading ? (
          <RequestMessage message="검색 결과를 불러오는 중이에요." />
        ) : errorMessage ? (
          <RequestMessage message={errorMessage} isError onRetry={retry} />
        ) : movies.length === 0 ? (
          <RequestMessage message="검색 결과가 없어요. 다른 제목으로 검색해 보세요." />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {movies.map((movie) => <SearchResultCard key={movie.id} movie={movie} />)}
          </div>
        )}
        {!isLoading && !errorMessage && response && response.total_pages > 1 && (
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
