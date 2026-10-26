import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
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
