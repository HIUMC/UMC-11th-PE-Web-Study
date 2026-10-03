import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="text-muted">표시할 영화가 없어요.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-5 max-[960px]:grid-cols-3 max-[560px]:grid-cols-2">
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