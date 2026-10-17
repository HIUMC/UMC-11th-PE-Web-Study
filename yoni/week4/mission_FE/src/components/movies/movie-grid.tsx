import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          posterPath={movie.posterPath}
          isBookmarked={movie.isBookmarked}
          onToggleBookmark={() => onToggleBookmark(movie.id)}
        />
      ))}
    </div>
  );
}
