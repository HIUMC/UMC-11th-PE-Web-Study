import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[8/9] overflow-hidden rounded-[10px] bg-slate-200 shadow-sm">
        <Link
          className="block size-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-300"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.018]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          variant="icon"
        />
      </div>
      <h2 className="mt-3 truncate text-sm leading-snug font-bold tracking-[-0.025em] text-slate-900">
        <Link
          className="rounded-sm hover:text-blue-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <p className="mt-1 text-xs text-slate-400">{movie.releaseDate}</p>
    </article>
  );
}
