import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li>
      <div className="relative overflow-hidden rounded-lg">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          >
          <img
            className="block aspect-2/3 w-full object-cover"
            src={movie.posterPath} 
            alt={`${movie.title} 포스터`} 
          />
        </Link>
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md",
            movie.isBookmarked ? "bg-blue-600" : "bg-white/90",
          )}
        >
          <img
            className={cn("h-4 w-4", movie.isBookmarked && "brightness-0 invert")} 
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <p className="mt-2 text-sm font-medium text-neutral-900">{movie.title}</p>
      <p className="mt-1 text-xs text-neutral-500">{movie.releaseDate}</p>
    </li>
  );
}
