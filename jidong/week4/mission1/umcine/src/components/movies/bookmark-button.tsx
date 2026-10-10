import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  // icon: 포스터 위 작은 버튼, label: 상세 화면의 글자 버튼
  variant?: "icon" | "label";
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const actionLabel = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={`${movieTitle} ${actionLabel}`}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex items-center justify-center rounded-md",
        variant === "icon" && "h-7 w-7",
        variant === "label" && "gap-2 px-4 py-2 text-sm text-white",
        isBookmarked
          ? "bg-blue-600"
          : variant === "icon"
            ? "bg-white/90"
            : "bg-gray-400",
        className,
      )}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
        className={cn(
          "h-4 w-4",
          (isBookmarked || variant === "label") && "invert",
        )}
      />
      {variant === "label" && actionLabel}
    </button>
  );
}
