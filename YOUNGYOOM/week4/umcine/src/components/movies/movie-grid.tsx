import { MovieCard } from "./movie-card.tsx";
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookMark: (movieId: number) => void;
  sortOrder: "default" | "title";
  onSortChange: (sortOrder: "default" | "title") => void;
}

export const MovieGrid = ({
  movies,
  onToggleBookMark,
  sortOrder,
  onSortChange,
}: MovieGridProps) => {
  return (
    <div className="p-6 px-20">
      <div className="mx-auto flex max-w-fit flex-col gap-3">
        <h1 className="text-bold text-[38px] font-bold text-left">영화목록</h1>
        {/*조금 더 유연하게 하기위해서 flex 사용*/}
        <select
          aria-label="영화 정렬"
          value={sortOrder}
          onChange={(event) => {
            onSortChange(event.target.value === "title" ? "title" : "default");
          }}
          className="mb-4 rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="default">기본순</option>
          <option value="title">제목순</option>
        </select>
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
