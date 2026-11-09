import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const TOTAL_PAGES = 5;

export default function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto max-w-[1200px] px-6 pt-8 pb-16">
      <h1 className="mb-6 text-[28px] font-bold">영화 목록</h1>
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onChangePage={setCurrentPage}
      />
    </main>
  );
}
