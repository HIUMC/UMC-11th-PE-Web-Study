import type { MovieCardData } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: MovieCardData[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[421px]:grid-cols-2 min-[681px]:grid-cols-3 min-[941px]:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
