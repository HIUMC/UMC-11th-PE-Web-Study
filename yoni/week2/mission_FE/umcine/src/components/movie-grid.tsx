import type { Movie } from "../types/movie";
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
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          posterPath={movie.posterPath}
          isBookmarked={movie.isBookmarked}
          onToggleBookmark={() => onToggleBookmark(movie.id)}
        />
      ))}
    </section>
  );
}