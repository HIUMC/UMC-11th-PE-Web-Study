import { useState } from "react";
import "./App.css";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies as initialMovies } from "./data/movies";

const TOTAL_PAGES = 5;

function App() {
  const [movies, setMovies] = useState(initialMovies);
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
    <div className="app">
      <Header />

      <main className="page-shell">
        <section className="movie-list" aria-labelledby="movie-list-title">
          <h1 id="movie-list-title">영화 목록</h1>
          <MovieGrid
            movies={movies}
            onToggleBookmark={handleToggleBookmark}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <img
            className="tmdb-logo"
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
          />
          <p>
            본 서비스는 학습 목적으로 제작되었으며, 영화 정보는 TMDB를
            참고했습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
