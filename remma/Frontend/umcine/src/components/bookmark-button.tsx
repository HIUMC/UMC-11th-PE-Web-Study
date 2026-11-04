import type { MouseEvent } from "react";
import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  /** overlay: 포스터 위 아이콘 버튼, labeled: 아이콘 + 텍스트 버튼 */
  variant?: "overlay" | "labeled";
  className?: string;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function BookmarkButton({ movieId, variant = "labeled", className }: BookmarkButtonProps) {
  // 이 영화의 북마크 여부만 구독해서, 다른 영화가 바뀔 때는 리렌더링되지 않아요.
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 카드처럼 링크 근처에 있을 때 상세 페이지로 이동하지 않도록 막아요.
    event.preventDefault();
    event.stopPropagation();
    toggleBookmark(movieId);
  };

  if (variant === "overlay") {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={isBookmarked}
        onClick={handleClick}
        className={cn(
          "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors",
          isBookmarked
            ? "bg-blue-600 text-white"
            : "bg-black/50 text-white/90 backdrop-blur-xs hover:bg-black/70",
          className,
        )}
      >
        <BookmarkIcon filled={isBookmarked} />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        isBookmarked
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50",
        className,
      )}
    >
      <BookmarkIcon filled={isBookmarked} />
      {label}
    </button>
  );
}