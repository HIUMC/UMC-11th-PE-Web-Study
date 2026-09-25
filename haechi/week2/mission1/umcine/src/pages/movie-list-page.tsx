import { useState } from "react";
import Header from "../components/header";
import MovieGrid from "../components/movie-grid";
import Pagination from "../components/pagination";
import Footer from "../components/footer";
import { movies as initialMovies } from "../data/movies";
import type { Movie } from "../types/movie";

const TOTAL_PAGES = 5;

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return (
    <div className="page">
      <Header activePath="/" />
      <main className="page__main">
        <h1 className="page__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} onPageChange={setCurrentPage} />
      </main>
      <Footer />
    </div>
  );
}
