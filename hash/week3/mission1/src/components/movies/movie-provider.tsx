import { useState, type ReactNode } from "react";
import { movies as initialMovies } from "../../data/movies";
import { MovieContext } from "./movie-context";

interface MovieProviderProps {
  children: ReactNode;
}

export default function MovieProvider({
  children,
}: MovieProviderProps) {
  const [movies, setMovies] = useState(initialMovies);

  function toggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <MovieContext.Provider value={{ movies, toggleBookmark }}>
      {children}
    </MovieContext.Provider>
  );
}