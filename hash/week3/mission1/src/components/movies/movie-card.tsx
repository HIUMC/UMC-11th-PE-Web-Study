import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[175/198] w-full overflow-hidden rounded-[9px] bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="block h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={`${movie.title} 북마크 ${
            movie.isBookmarked ? "해제" : "추가"
          }`}
          aria-pressed={movie.isBookmarked}
          className={cn(
            "absolute right-2 top-2 grid h-[30px] w-7 cursor-pointer place-items-center rounded-[5px] border p-0 transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400",
            movie.isBookmarked
              ? "border-[#4765df] bg-[#4765df]"
              : "border-white bg-[#141820]/90",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-5 w-5 invert"
          />
        </button>
      </div>

      <h2
        className="mb-[3px] mt-[7px] truncate text-xs font-bold leading-[1.4]"
        title={movie.title}
      >
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-inherit no-underline hover:underline"
        >
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-[10px] leading-[1.4] text-[#8a909b]">
        {movie.releaseDate}
      </p>
    </article>
  );
}