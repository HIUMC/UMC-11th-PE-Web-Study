import { MovieCard } from "./movie-card";
import type { TmdbMovie } from "../../api/movies/models";

interface MovieGridProps {
  movies: TmdbMovie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </ul>
  );
}
