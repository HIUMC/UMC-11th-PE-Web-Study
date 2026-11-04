import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { ErrorMessage } from "../../components/error-message";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import {
  useViewSettingStore,
  type SortOrder,
} from "../../stores/view-setting-store";
import type { MovieCardItem } from "../../types/movie-card";
import { toMovieCardItem } from "../../utils/movies/movie-card-adapter";

const PAGE_SIZE = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const sortOrder = useViewSettingStore((state) => state.sortOrder);
  const setSortOrder = useViewSettingStore((state) => state.setSortOrder);

  const [movies, setMovies] = useState<MovieCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results.map(toMovieCardItem));
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  const sortedMovies =
    sortOrder === "title"
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title, "ko"))
      : movies;

  const totalPages = Math.ceil(sortedMovies.length / PAGE_SIZE);
  const pagedMovies = sortedMovies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSortChange = (nextSortOrder: SortOrder) => {
    setSortOrder(nextSortOrder);
    setCurrentPage(1);
  };

  let content;
  if (isLoading) {
    content = (
      <p className="px-8 py-10 text-gray-500">영화 목록을 불러오는 중이에요.</p>
    );
  } else if (errorMessage) {
    content = (
      <ErrorMessage
        message={errorMessage}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  } else if (movies.length === 0) {
    content = (
      <p className="px-8 py-10 text-gray-500">조건에 맞는 영화가 없어요.</p>
    );
  } else {
    content = (
      <>
        <MovieGrid movies={pagedMovies} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-between px-8 pt-6">
        <h1 className="text-2xl font-bold">영화 목록</h1>
        <label className="flex items-center gap-2 text-sm font-medium">
          정렬
          <select
            value={sortOrder}
            onChange={(event) =>
              handleSortChange(event.target.value as SortOrder)
            }
            className="h-9 rounded-lg border border-gray-300 bg-white px-3"
          >
            <option value="default">기본순</option>
            <option value="title">제목순</option>
          </select>
        </label>
      </div>
      {content}
    </main>
  );
}
