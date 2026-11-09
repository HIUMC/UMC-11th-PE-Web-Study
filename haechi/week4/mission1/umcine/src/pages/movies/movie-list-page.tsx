import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  // 북마크는 전역 store가 관리하고, 이 화면에서만 쓰는 페이지 번호는 로컬 상태로 둬요.
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-10 xl:px-20">
      <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">영화 목록</h1>
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
