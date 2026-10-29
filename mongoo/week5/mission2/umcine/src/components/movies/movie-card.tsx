import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movie.id) }}
      className="block min-w-0"
    >
      <div className="relative aspect-[200/228] w-full overflow-hidden rounded-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}

        <button
          type="button"
          aria-pressed={isBookmarked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(movie.id);
          }}
          className={cn(
            "absolute right-[9px] top-[9px] flex h-[31px] w-[31px] cursor-pointer items-center justify-center rounded-md border p-0 hover:opacity-90",
            isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#141414]/75",
          )}
        >
          <img
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-4 w-4 invert"
          />
        </button>
      </div>

      <p className="mt-[7px] truncate text-[13px] font-bold leading-[1.4] text-[#171717]">
        {movie.title}
      </p>
      <p className="mt-[3px] text-[11px] leading-[1.4] text-[#9ca3af]">
        {movie.release_date}
      </p>
    </Link>
  );
}
