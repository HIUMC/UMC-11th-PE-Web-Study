import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { BookmarkIcon } from "../icons";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex size-[34px] cursor-pointer items-center justify-center rounded-lg border-2 text-white",
            movie.isBookmarked ? "border-brand bg-brand" : "border-white bg-black/40",
          )}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <BookmarkIcon className="size-4" filled={movie.isBookmarked} />
        </button>
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