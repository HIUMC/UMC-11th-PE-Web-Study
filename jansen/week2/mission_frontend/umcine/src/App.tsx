import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid.tsx";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

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
    <div className="app">
      <Header />
      <main className="app-main">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </main>
    </div>
  );
}