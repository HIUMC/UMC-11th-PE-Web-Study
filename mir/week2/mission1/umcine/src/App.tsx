import "./App.css";
import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies"; 
import { type Movie } from "./types/movie";

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState<number>(1);

  function handleToggleBookmark(movieId: number) {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <MovieGrid 
          movies={movieList} 
          onToggleBookmark={handleToggleBookmark} 
        />
        <Pagination 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <img className="tmdb-logo" src="/images/logos/tmdb-logo.svg" alt="TMDB Logo" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <span className="tmdb-link">TMDB</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}