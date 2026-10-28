import { useNavigate, useSearch } from "@tanstack/react-router";
import { getPopularMovies } from "../../api/movies-api";
import {
  ErrorState,
  LoadingState,
} from "../../components/feedback/request-status";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useAsync } from "../../hooks/use-async";
import {
  useViewSettingsStore,
  type MovieSort,
} from "../../stores/view-settings-store";
import type { MovieSummary } from "../../types/movie";

const SORT_OPTIONS = [
  { value: "default", label: "기본순" },
  { value: "latest", label: "최신 개봉순" },
  { value: "title", label: "제목순" },
] as const;

function sortMovies(list: MovieSummary[], movieSort: MovieSort) {
  if (movieSort === "latest") {
    return [...list].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  }
  if (movieSort === "title") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }
  return list;
}

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const movieSort = useViewSettingsStore((state) => state.movieSort);
  const setMovieSort = useViewSettingsStore((state) => state.setMovieSort);
  const { state, retry } = useAsync(`popular:${page}`, (signal) =>
    getPopularMovies(page, signal),
  );

  function handlePageChange(nextPage: number) {
    navigate({ search: { page: nextPage > 1 ? nextPage : undefined } });
  }

  return (
    <main className="mx-auto max-w-[1312px] px-4 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-4xl font-bold text-ink">영화 목록</h1>
        <select
          aria-label="영화 정렬"
          value={movieSort}
          onChange={(event) => {
            const option = SORT_OPTIONS.find(
              (item) => item.value === event.target.value,
            );
            if (option) {
              setMovieSort(option.value);
            }
          }}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {state.status === "loading" && <LoadingState />}
      {state.status === "error" && (
        <ErrorState error={state.error} onRetry={retry} />
      )}
      {state.status === "success" && (
        <>
          <MovieGrid movies={sortMovies(state.data.movies, movieSort)} />
          <Pagination
            currentPage={state.data.page}
            totalPages={state.data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
