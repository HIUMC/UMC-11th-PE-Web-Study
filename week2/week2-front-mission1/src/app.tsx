import { useState } from "react";
import { movies as initialMovies } from "./datas/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import type { Movie } from "./types/movie";

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleBookmark = (movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <section className="page-heading" aria-labelledby="movie-list-title">
          <div>
            <p className="eyebrow">UMCINE MOVIES</p>
            <h1 id="movie-list-title">영화 목록</h1>
            <p className="page-description">지금 가장 보고 싶은 영화를 찾아보세요.</p>
          </div>
          <p className="movie-count">
            <strong>{movies.length}</strong> movies
          </p>
        </section>
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}

export default App;
