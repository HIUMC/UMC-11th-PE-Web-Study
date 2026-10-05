import type { ReactNode } from "react";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
  children?: ReactNode;
}

export function BookmarkButton({
  movieId,
  className,
  children,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-1.5 rounded-md border",
        isBookmarked
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
        className,
      )}
    >
      <img
        src="/icons/bookmark.svg"
        alt=""
        className={cn("h-4 w-4", isBookmarked && "brightness-0 invert")}
      />
      {children}
    </button>
  );
}