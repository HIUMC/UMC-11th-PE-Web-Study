import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "text";
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "icon",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const iconSrc = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={
        isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크`
      }
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        variant === "icon" &&
          cn(
            "absolute right-2 top-2 flex size-8 items-center justify-center rounded-md",
            isBookmarked ? "bg-blue-600" : "bg-black/50",
          ),
        variant === "text" &&
          cn(
            "flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-extrabold",
            isBookmarked
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-[#17191e]",
          ),
      )}
    >
      <img
        src={iconSrc}
        alt=""
        className={cn(
          "size-4 brightness-0",
          (variant === "icon" || isBookmarked) && "invert",
        )}
      />
      {variant === "text" && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
