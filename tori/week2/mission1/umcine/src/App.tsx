import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";
import Header from "./header"
import MovieGrid from "./movie-grid";
// import Pagination from "./components/pagination"; //임시
 
export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
 
  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };
 
  return (
    <div className="app">
      <Header />
      <main className="main">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        {/* <Pagination currentPage={1} totalPages={1} /> */}
      </main>
      <footer className="footer">
        <p className="footer-text">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
}