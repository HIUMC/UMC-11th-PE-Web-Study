import { useState } from "react";
import "./movie-list-page.css";
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
    <main className="movie-list-page">
      <h1 className="movie-list-page__title">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}
