import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getMovies } from "../../api/movies/get-movies";
import type { GetMoviesResponse } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import RequestMessage from "../../components/movies/request-message";
import { isMovieSort, useUiSettingsStore } from "../../stores/ui-settings-store";
import { toMovieCard } from "../../utils/movies/movie-adapter";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });

  // URL 변경 시 이전 페이지의 데이터와 요청 상태를 함께 초기화한다.
  return <MovieListContent key={page} page={page} />;
}

function MovieListContent({ page }: { page: number }) {
  const navigate = useNavigate({ from: "/" });
  const [response, setResponse] = useState<GetMoviesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const movieSort = useUiSettingsStore((state) => state.movieSort);
  const setMovieSort = useUiSettingsStore((state) => state.setMovieSort);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        const result = await getMovies({ page });
        if (!ignore) setResponse(result);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovies();
    return () => { ignore = true; };
  }, [page, attempt]);

  function retry() {
    setIsLoading(true);
    setErrorMessage(null);
    setAttempt((value) => value + 1);
  }

  const movies = useMemo(() => {
    const items = response?.results.map(toMovieCard) ?? [];
    if (movieSort === "latest") {
      return items.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    }
    if (movieSort === "title") {
      return items.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    }
    return items;
  }, [response, movieSort]);

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[32px]">
            영화 목록
          </h1>
          <div className="flex items-center gap-2">
            <label htmlFor="movie-sort" className="text-sm font-medium text-[#6b7280]">
              정렬
            </label>
            <select
              id="movie-sort"
              value={movieSort}
              onChange={(event) => {
                if (isMovieSort(event.target.value)) setMovieSort(event.target.value);
              }}
              className="cursor-pointer rounded-lg border border-[#d5d9e2] bg-white px-3 py-2 text-sm text-[#374151] focus-visible:outline-2 focus-visible:outline-[#4765df]"
            >
              <option value="default">인기순</option>
              <option value="latest">최신 개봉일순</option>
              <option value="title">제목순</option>
            </select>
          </div>
        </div>
        <p className="mb-5 text-xs text-[#8a909b]">
          TMDB 인기 영화 · {page}페이지 · 정렬은 현재 페이지의 영화에 적용돼요.
        </p>
        {isLoading ? (
          <RequestMessage message="영화 목록을 불러오는 중이에요." />
        ) : errorMessage ? (
          <RequestMessage message={errorMessage} isError onRetry={retry} />
        ) : movies.length === 0 ? (
          <RequestMessage message="표시할 영화가 없어요." />
        ) : (
          <MovieGrid movies={movies} />
        )}
        {!isLoading && !errorMessage && response && response.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={response.total_pages}
            onPageChange={(nextPage) => {
              void navigate({
                to: "/",
                search: { page: nextPage > 1 ? nextPage : undefined },
              });
            }}
          />
        )}
      </div>
    </main>
  );
}
