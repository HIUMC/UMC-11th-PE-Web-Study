import { cn } from "../utils/cn";
import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "action";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        variant === "card"
          ? "absolute right-2.5 top-2.5 z-[1] flex size-8.5 items-center justify-center rounded-lg border"
          : "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface outline outline-1 outline-offset-[-1px] outline-bg-surface",
        variant === "card" &&
          (isBookmarked
            ? "border-action-primary bg-action-primary"
            : "border-bg-surface bg-text-primary"),
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        src={`/icons/${isBookmarked ? "bookmark.svg" : "bookmark-outline.svg"}`}
        alt=""
        aria-hidden="true"
        className={cn(
          "size-6 shrink-0 brightness-0 invert",
          variant === "action" && "size-4",
        )}
      />
      {variant === "action" && (
        <span>{isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}</span>
      )}
    </button>
  );
}