import { MovieCard } from "./movie-card.tsx";
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookMark: (movieId: number) => void;
}

export const MovieGrid = ({ movies, onToggleBookMark }: MovieGridProps) => {
  return (
    <div className="p-6 px-20">
      <div className="mx-auto flex max-w-fit flex-col gap-3">
        <h1 className="text-bold text-[38px] font-bold text-left">영화목록</h1>
        {/*조금 더 유연하게 하기위해서 flex 사용*/}
        <section className="flex flex-wrap gap-8">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleBookMark={onToggleBookMark}
            />
          ))}
        </section>
      </div>
    </div>
  );
};
