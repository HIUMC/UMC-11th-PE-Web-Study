import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import "../../App.css";

export function MovieListPage() {
  const [movieList, setMovieList] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="movie-page">
      <h1 className="page-title">영화 목록</h1>

      <MovieGrid
        movies={movieList}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination />
    </main>
  );
}