import type { TmdbMovie } from "@/api/movies/models";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
