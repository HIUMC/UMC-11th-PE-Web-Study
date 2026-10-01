import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import MovieGrid from "../../components/movies/movie-grid";
// import Pagination from "../../components/movies/pagination"; //임시

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[1280px] flex-1 pb-24 pt-6">
        <h1 className="mb-5 text-[32px] font-bold tracking-tight">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        {/* <Pagination currentPage={1} totalPages={1} /> */}
      </main>
      <footer className="border-t border-border bg-surface">
        <p className="mx-auto max-w-[1280px] py-5 text-right text-xs text-text-sub">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a className="underline" href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
}