import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movie";

const TOTAL_PAGES = 5;

export default function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <h1 className="mb-5 text-[28px] font-bold text-[#191D23]">영화 목록</h1>
        <MovieGrid movies={movies} />
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} onPageChange={setCurrentPage} />
      </div>
    </main>
  );
}
