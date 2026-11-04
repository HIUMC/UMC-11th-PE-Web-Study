import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  const toggleBookmark = (id: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <main className="mx-auto w-[calc(100%-144px)] max-w-[1120px] pt-6 pb-20">
      <h1 className="mb-[18px] text-left text-[28px] leading-[1.3] font-bold text-[#1f1f1f]">
        영화 목록
      </h1>

      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />

      <Pagination />
    </main>
  );
}
