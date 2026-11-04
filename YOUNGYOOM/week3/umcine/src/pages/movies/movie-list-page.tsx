import { useState } from "react";

import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";

import { Pagination } from "../../components/movies/pagination";

const ITEMS_PER_PAGE = 10; //한페이지당 보여줄 영화 개수를 적음

export function MovieListPage() {
  const [movie, setMovie] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookMark = (movieId: number) => {
    setMovie((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  const totalPages = 5;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = movie.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="">
      <MovieGrid
        movies={currentMovies}
        onToggleBookMark={handleToggleBookMark}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
