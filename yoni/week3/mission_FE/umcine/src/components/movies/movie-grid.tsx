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
    <div className="grid grid-cols-5 gap-x-4 gap-y-[18px]">
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
