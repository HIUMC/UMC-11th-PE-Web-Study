import { useState } from "react";
import type { Movie } from "../../types/movie";
import { movies as initialMovies } from "../../data/movies";
import { MovieGrid} from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }
  return (
    <main className="mx-auto max-w-[1200px]  px-6 pb-16">
      <h1 className="mt-8 mb-5 text-[28px] font-semibold text-neutral-900">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}