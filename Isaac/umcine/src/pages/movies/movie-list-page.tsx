import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

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
    <main className="mx-auto w-full max-w-[1120px] px-4 pt-10 pb-16 xl:px-0">
      <h1 className="mb-6 text-[28px] leading-[1.3]">
        영화 목록
      </h1>

      <MovieGrid
        movies={movieList}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination />
    </main>
  );
}