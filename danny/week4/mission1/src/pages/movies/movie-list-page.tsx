import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import {
  useViewSettingsStore,
  type MovieSort,
} from "../../stores/view-settings-store";
import type { Movie } from "../../types/movie";

const SORT_OPTIONS = [
  { value: "default", label: "기본순" },
  { value: "latest", label: "최신 개봉순" },
  { value: "title", label: "제목순" },
] as const;

function sortMovies(list: Movie[], movieSort: MovieSort) {
  if (movieSort === "latest") {
    return [...list].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  }
  if (movieSort === "title") {
    return [...list].sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }
  return list;
}

export function MovieListPage() {
  const movieSort = useViewSettingsStore((state) => state.movieSort);
  const setMovieSort = useViewSettingsStore((state) => state.setMovieSort);

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
      <MovieGrid movies={sortMovies(movies, movieSort)} />
      <Pagination />
    </main>
  );
}
