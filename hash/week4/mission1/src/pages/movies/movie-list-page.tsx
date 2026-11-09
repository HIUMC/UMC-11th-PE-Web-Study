import { useMemo, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMovies } from "../../hooks/use-movies";
import {
  isMovieSort,
  useUiSettingsStore,
} from "../../stores/ui-settings-store";

export function MovieListPage() {
  const { movies, toggleBookmark } = useMovies();
  const [currentPage, setCurrentPage] = useState(1);

  const movieSort = useUiSettingsStore((state) => state.movieSort);
  const setMovieSort = useUiSettingsStore(
    (state) => state.setMovieSort,
  );

  const sortedMovies = useMemo(() => {
    const copiedMovies = [...movies];

    if (movieSort === "latest") {
      return copiedMovies.sort((a, b) =>
        b.releaseDate.localeCompare(a.releaseDate),
      );
    }

    if (movieSort === "title") {
      return copiedMovies.sort((a, b) =>
        a.title.localeCompare(b.title, "ko"),
      );
    }

    return copiedMovies;
  }, [movies, movieSort]);

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[32px]">
            영화 목록
          </h1>

          <div className="flex items-center gap-2">
            <label
              htmlFor="movie-sort"
              className="text-sm font-medium text-[#6b7280]"
            >
              정렬
            </label>

            <select
              id="movie-sort"
              value={movieSort}
              onChange={(event) => {
                const nextSort = event.target.value;

                if (isMovieSort(nextSort)) {
                  setMovieSort(nextSort);
                  setCurrentPage(1);
                }
              }}
              className="cursor-pointer rounded-lg border border-[#d5d9e2] bg-white px-3 py-2 text-sm text-[#374151] focus-visible:outline-2 focus-visible:outline-[#4765df]"
            >
              <option value="default">기본순</option>
              <option value="latest">최신 개봉일순</option>
              <option value="title">제목순</option>
            </select>
          </div>
        </div>

        <MovieGrid
          movies={sortedMovies}
          onToggleBookmark={toggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}