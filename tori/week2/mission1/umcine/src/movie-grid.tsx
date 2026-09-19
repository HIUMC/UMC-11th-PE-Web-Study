import type { Movie } from "./types/movie";
import MovieCard from "./movie-card";
import "./movie-grid.css";
 
interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (id: number) => void;
}
 
export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
      ))}
    </ul>
  );
}
 