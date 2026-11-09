import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`;

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
        <button
          className={cn(
            "absolute top-2.5 right-2.5 grid size-9 cursor-pointer place-items-center rounded-[9px] border-2 shadow-md backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200",
            movie.isBookmarked
              ? "border-blue-500 bg-blue-500 hover:bg-blue-600"
              : "border-white/90 bg-slate-900/80 hover:bg-slate-900/95",
          )}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-6 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
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
