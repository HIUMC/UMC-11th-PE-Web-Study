import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { useMovies } from "../../components/movies/movie-context";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const { movies, toggleBookmark } = useMovies();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1328px] px-6 pb-20 pt-6">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-[32px]">
          영화 목록
        </h1>

        <MovieGrid
          movies={movies}
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