import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="flex-1 bg-[#f6f8fb] px-4 pt-8 pb-18 sm:px-6">
      <section
        className="mx-auto max-w-320"
        aria-labelledby="movie-list-title"
      >
        <h1
          className="mb-6 text-3xl font-extrabold tracking-[-0.04em] text-slate-900"
          id="movie-list-title"
        >
          영화 목록
        </h1>
        <MovieGrid movies={movies} />
        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
