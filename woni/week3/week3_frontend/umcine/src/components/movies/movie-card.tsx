import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-300">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="size-full object-cover"
          />
        </Link>
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크`
          }
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute right-2 top-2 flex size-8 items-center justify-center rounded-md",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/50",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="size-4 brightness-0 invert"
          />
        </button>
      </div>
      <h2 className="truncate text-[15px] font-semibold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <p className="text-[13px] text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}
