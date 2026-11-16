import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movieQueryOptions } from "../../api/movies/movie-query-options";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import RequestMessage from "../../components/movies/request-message";
import QueryStatusNotice from "../../components/movies/query-status-notice";
import { isMovieSort, useUiSettingsStore } from "../../stores/ui-settings-store";
import { toMovieCard } from "../../utils/movies/movie-adapter";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const moviesQuery = useQuery(movieQueryOptions.list(page));
  const response = moviesQuery.data;
  const movieSort = useUiSettingsStore((state) => state.movieSort);
  const setMovieSort = useUiSettingsStore((state) => state.setMovieSort);

  function retry() {
    void moviesQuery.refetch();
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
        {response && (
          <QueryStatusNotice
            isFetching={moviesQuery.isFetching}
            isPaused={moviesQuery.isPaused}
            hasError={moviesQuery.isError}
            onRetry={retry}
          />
        )}
        {moviesQuery.isPending ? (
          <RequestMessage message={moviesQuery.isPaused
            ? "네트워크 연결을 기다리고 있어요."
            : "영화 목록을 불러오는 중이에요."} />
        ) : moviesQuery.isError && !response ? (
          <RequestMessage message="영화 목록을 불러오지 못했어요." isError onRetry={retry} />
        ) : movies.length === 0 ? (
          <RequestMessage message="표시할 영화가 없어요." />
        ) : (
          <MovieGrid movies={movies} />
        )}
        {response && response.total_pages > 1 && (
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
