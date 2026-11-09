import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <MoviePoster posterPath={movie.poster_path} title={movie.title} />
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2 top-2"
        />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="text-sm">{movie.title}</h3>
      </Link>
      <p className="text-[13px] text-gray-500">
        {formatReleaseDate(movie.release_date)}
      </p>
    </article>
  );
}
