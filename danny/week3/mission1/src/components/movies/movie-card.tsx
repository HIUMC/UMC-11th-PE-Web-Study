import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movie.id) }}
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-border">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={movie.isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          aria-pressed={movie.isBookmarked}
          onClick={(event) => {
            event.preventDefault();
            onToggleBookmark(movie.id);
          }}
          className={cn(
            "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md bg-ink/70 backdrop-blur-sm",
            movie.isBookmarked && "bg-brand",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-4 w-4 invert"
          />
        </button>
      </div>
      <div>
        <h3 className="truncate text-sm font-semibold text-ink">
          {movie.title}
        </h3>
        <p className="text-xs text-ink-muted">{movie.releaseDate}</p>
      </div>
    </Link>
  );
}
