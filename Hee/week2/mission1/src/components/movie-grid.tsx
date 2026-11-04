import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

type MovieGridProps = {
  movies: Movie[];
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
};

export default function MovieGrid({ movies, bookmarkedIds, onToggleBookmark }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.has(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
