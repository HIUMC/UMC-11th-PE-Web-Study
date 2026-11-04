import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      aria-label={`${movieTitle} 북마크 ${
        isBookmarked ? "해제" : "추가"
      }`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]",
        isBookmarked
          ? "border-[#4765df] bg-[#4765df] text-white hover:bg-[#3b56ca]"
          : "border-[#d5d9e2] bg-white text-[#4b5563] hover:bg-[#eef1f7]",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        className={cn("h-4 w-4", isBookmarked && "invert")}
      />

      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}