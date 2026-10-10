import type { ReactNode } from "react";
import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  children?: ReactNode;
}

export function BookmarkButton({ movieId, children }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "inline-flex h-8 w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-colors",
        children ? "px-6 py-3" : "w-8",
        isBookmarked
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 border hover:bg-gray-200 border-gray-500",
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
      />
      {children}
    </button>
  );
}
