import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import {
  useViewSettingStore,
  type SortOrder,
} from "../../stores/view-setting-store";

const PAGE_SIZE = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const sortOrder = useViewSettingStore((state) => state.sortOrder);
  const setSortOrder = useViewSettingStore((state) => state.setSortOrder);

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
      <MovieGrid movies={pagedMovies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
