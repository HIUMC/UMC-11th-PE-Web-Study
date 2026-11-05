import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="text-muted">조건에 맞는 영화가 없어요.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-5 max-[960px]:grid-cols-3 max-[560px]:grid-cols-2">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}