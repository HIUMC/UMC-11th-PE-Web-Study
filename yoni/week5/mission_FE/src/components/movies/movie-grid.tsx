import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
  bookmarkedMovieIds: number[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({
  movies,
  bookmarkedMovieIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.release_date}
          posterPath={getTmdbPosterUrl(movie.poster_path)}
          isBookmarked={bookmarkedMovieIds.includes(movie.id)}
          onToggleBookmark={() => onToggleBookmark(movie.id)}
        />
      ))}
    </div>
  );
}
