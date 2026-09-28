import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-8 py-6 min-[480px]:grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
