import { type Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";
import { useUIStore } from "../../stores/ui-store";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  const cardSize = useUIStore((state) => state.cardSize);

  let gridClass = "grid w-full gap-5 ";

  if (cardSize === "sm") {
    gridClass += "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6";
  } else if (cardSize === "lg") {
    gridClass += "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  } else {
    gridClass += "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
  }

  return (
    <>
      <h2 className="mb-5 text-left text-[1.4rem] font-bold text-[#0f172a]">
        영화 목록
      </h2>

      <section className={gridClass}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </>
  );
}
