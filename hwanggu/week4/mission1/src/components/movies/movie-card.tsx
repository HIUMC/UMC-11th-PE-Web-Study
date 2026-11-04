import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="flex flex-col gap-2">
      <div className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-[#262626]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/90 to-black/10 p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-[15px] font-bold">{movie.title}</p>
            <p className="line-clamp-5 text-[13px] leading-relaxed text-[#e0e0e0]">
              {movie.overview}
            </p>
          </div>
        </Link>
        <button
          type="button"
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => toggleBookmark(movie.id)}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center rounded-full bg-black/55 transition-transform hover:scale-110",
            isBookmarked ? "text-[#ffd43b]" : "text-white",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </div>
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="text-[15px] font-semibold hover:underline"
      >
        {movie.title}
      </Link>
      <p className="text-[13px] text-[#a0a0a0]">{movie.releaseDate}</p>
    </article>
  );
}
