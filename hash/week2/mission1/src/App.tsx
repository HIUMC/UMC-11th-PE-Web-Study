import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import Footer from "./components/footer";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="page-shell">
      <Header />

      <main className="movie-page" id="movie-list">
        <div className="movie-page__content">
          <h1 className="movie-page__heading">영화 목록</h1>

          <MovieGrid
            movies={movies}
            onToggleBookmark={handleToggleBookmark}
          />

          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}