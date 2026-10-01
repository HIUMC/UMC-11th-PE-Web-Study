import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section
      className="grid grid-cols-2 gap-x-4 gap-y-8 min-[640px]:gap-x-5 min-[640px]:gap-y-[34px] min-[1024px]:grid-cols-3 min-[1280px]:grid-cols-5 max-[360px]:grid-cols-1"
      id="movies"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}

export default MovieGrid;
