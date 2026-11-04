import { useState } from "react";
import MovieGrid from "../components/movie-grid";
import Pagination from "../components/pagination";
import { movies } from "../data/movie";

const TOTAL_PAGES = 5;

export default function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(
    () => new Set(movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id)),
  );

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <h1 className="mb-5 text-[28px] font-bold text-[#191D23]">영화 목록</h1>
        <MovieGrid movies={movies} bookmarkedIds={bookmarkedIds} onToggleBookmark={toggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} onPageChange={setCurrentPage} />
      </div>
    </main>
  );
}
