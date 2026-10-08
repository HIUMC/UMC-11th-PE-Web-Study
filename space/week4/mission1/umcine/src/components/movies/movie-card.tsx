import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex min-w-0 flex-col items-start gap-1">
      <div className="relative aspect-[121/137] w-full overflow-hidden rounded-lg">
        <Link
          className="block size-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block size-full object-cover"
            src={movie.posterPath}
            alt="Movie Poster"
          />
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>
      <Link
        className="block w-full"
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <div className="flex min-h-7 w-full items-center truncate text-sm leading-[17px] font-extrabold text-text-primary [font-family:Pretendard]">
          {movie.title}
        </div>
        <div className="w-full truncate text-xs leading-[14px] font-normal text-text-tertiary [font-family:Pretendard]">
          {movie.releaseDate}
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;
