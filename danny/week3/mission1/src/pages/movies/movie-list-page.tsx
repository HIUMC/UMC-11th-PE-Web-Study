import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState(
    () =>
      new Set(
        initialMovies
          .filter((movie) => movie.isBookmarked)
          .map((movie) => movie.id),
      ),
  );

  function handleToggleBookmark(movieId: number) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(movieId)) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }
      return next;
    });
  }

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedIds.has(movie.id),
  }));

  return (
    <main className="mx-auto max-w-[1312px] px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold text-ink">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}
