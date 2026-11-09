import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies"; 
import { type Movie } from "../../types/movie";

export function MovieListPage() {
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
    <>
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-5 px-5 py-6 md:px-[80px]">
        <MovieGrid 
          movies={movieList} 
          onToggleBookmark={handleToggleBookmark} 
        />
        <Pagination 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      </main>

      <footer className="mt-auto flex min-h-[57px] items-center border-t border-[#E3E6EB] bg-white px-5 py-4 md:px-[80px]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-end gap-2 text-xs font-normal leading-none text-[#606774]">
          <img 
            className="block h-6 w-6" 
            src="/images/logos/tmdb-logo.svg" 
            alt="TMDB Logo" 
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <span className="underline decoration-solid">TMDB</span>.
          </p>
        </div>
      </footer>
    </>
  );
}