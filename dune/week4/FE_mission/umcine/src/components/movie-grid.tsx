import type { TmdbMovieListItem } from "../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}