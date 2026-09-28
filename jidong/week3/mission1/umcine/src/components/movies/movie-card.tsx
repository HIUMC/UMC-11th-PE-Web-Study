import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-white/90",
            movie.isBookmarked && "bg-blue-600",
          )}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            className="h-4 w-4"
          />
        </button>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="text-sm">{movie.title}</h3>
      </Link>
      <p className="text-[13px] text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}
