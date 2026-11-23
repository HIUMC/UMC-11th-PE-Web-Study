import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
  favoriteMovieIds: Set<number>;
  favoritesDisabled: boolean;
}

export default function MovieGrid({
  movies,
  favoriteMovieIds,
  favoritesDisabled,
}: MovieGridProps) {
  return (
    <ul className="grid grid-cols-5 gap-x-5 gap-y-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoriteMovieIds.has(movie.id)}
          favoritesDisabled={favoritesDisabled}
        />
      ))}
    </ul>
  );
}