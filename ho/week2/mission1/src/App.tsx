import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import Footer from "./components/footer";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="app">
      <Header isLoggedIn={false} />
      <main className="main">
        <div className="container">
          <h1 className="page-title">영화 목록</h1>
          <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
