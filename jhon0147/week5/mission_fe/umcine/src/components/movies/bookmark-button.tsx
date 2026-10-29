import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "text",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const label = isBookmarked
    ? `${movieTitle} 북마크 해제`
    : `${movieTitle} 북마크 추가`;

  if (variant === "icon") {
    return (
      <button
        className={cn(
          "absolute top-2.5 right-2.5 grid size-9 cursor-pointer place-items-center rounded-[9px] border-2 shadow-md backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200",
          isBookmarked
            ? "border-blue-500 bg-blue-500 hover:bg-blue-600"
            : "border-white/90 bg-slate-900/80 hover:bg-slate-900/95",
          className,
        )}
        type="button"
        aria-label={label}
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movieId)}
      >
        <img
          className="size-6 invert"
          src={
            isBookmarked
              ? "/icons/bookmark.svg"
              : "/icons/bookmark-outline.svg"
          }
          alt=""
        />
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg px-5 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200",
        isBookmarked
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-slate-900 hover:bg-slate-800",
        className,
      )}
      type="button"
      aria-label={label}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-5 invert"
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}
