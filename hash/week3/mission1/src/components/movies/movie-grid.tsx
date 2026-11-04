import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p>표시할 영화가 없어요.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 min-[421px]:grid-cols-2 min-[681px]:grid-cols-3 min-[941px]:grid-cols-5">
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