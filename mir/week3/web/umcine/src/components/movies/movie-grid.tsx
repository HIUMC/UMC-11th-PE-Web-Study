import { type Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <>
      <h2 className="mb-5 text-left text-[1.4rem] font-bold text-[#0f172a]">
        영화 목록
      </h2>
      
      <section className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </section>
    </>
  );
}