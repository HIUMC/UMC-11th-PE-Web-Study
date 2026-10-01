import { MovieCard } from "./movie-card";
import type { Movie } from "./../types/moive.ts";
import "./movie-grid.css";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookMark: (movieId: number) => void;
}

export const MovieGrid = ({ movies, onToggleBookMark }: MovieGridProps) => {
  return (
    <div className="body_container">
      <h1>영화목록</h1>
      <div className="grid_container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookMark={onToggleBookMark}
          />
        ))}
      </div>
    </div>
  );
};
