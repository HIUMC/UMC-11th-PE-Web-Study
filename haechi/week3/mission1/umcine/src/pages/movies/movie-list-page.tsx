import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-10 xl:px-20">
      <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
