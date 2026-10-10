import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article>
      <div className="relative aspect-[7/8] overflow-hidden rounded-xl bg-line">
        <Link
          className="block h-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            src={movie.posterPath}
            alt={movie.title}
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>

      <h3 className="mt-2.5 truncate text-[15px] font-bold text-ink">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-muted">{movie.releaseDate}</p>
    </article>
  );
}