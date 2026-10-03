import { createContext, useContext } from "react";
import type { Movie } from "../../types/movie";

interface MovieContextValue {
  movies: Movie[];
  toggleBookmark: (movieId: number) => void;
}

export const MovieContext = createContext<MovieContextValue | null>(null);

export function useMovies() {
  const context = useContext(MovieContext);

  if (context === null) {
    throw new Error("useMovies는 MovieProvider 안에서 사용해야 합니다.");
  }

  return context;
}