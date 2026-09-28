import { useState } from "react";
import MovieGrid from "./components/movies/movie-grid";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  function handleToggleBookmark(id: number) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-8 py-9 lg:px-12 lg:py-10">
      <h1 className="mb-6 text-4xl font-bold tracking-[-0.04em]">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
    </main>
  );
}
