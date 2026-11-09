import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  /** icon: 포스터 위 아이콘 버튼 / labeled: 아이콘 + "북마크 추가·해제" 문구 */
  variant?: "icon" | "labeled";
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  // selector로 필요한 값만 골라요. 이 영화의 북마크 여부가 바뀔 때만 다시 렌더링돼요.
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      aria-label={variant === "icon" ? `${movieTitle} ${label}` : undefined}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-lg border",
        variant === "icon" ? "size-[34px] p-0" : "h-[42px] px-4 text-sm font-extrabold text-surface",
        isBookmarked ? "border-primary bg-primary" : "border-surface bg-ink",
        className,
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        width={variant === "icon" ? 24 : 20}
        height={variant === "icon" ? 24 : 20}
        // 제공된 아이콘은 검은색이라 흰색으로 반전
        className="invert"
      />
      {variant === "labeled" && label}
    </button>
  );
}
