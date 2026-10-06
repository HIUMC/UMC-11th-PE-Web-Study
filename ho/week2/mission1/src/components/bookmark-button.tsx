import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "search" | "detail";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "inline-flex items-center justify-center transition-colors",
        variant === "card" &&
          "absolute right-2.5 top-2.5 size-9 rounded-md border border-white/90 bg-slate-950/60 text-white hover:bg-slate-950/80",
        variant === "card" &&
          isBookmarked &&
          "border-blue-600 bg-blue-600 hover:bg-blue-700",
        variant === "search" &&
          "size-9 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-600",
        variant === "search" &&
          isBookmarked &&
          "border-blue-600 bg-blue-50 text-blue-600",
        variant === "detail" &&
          "mt-6 h-11 gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700",
        variant === "detail" && isBookmarked && "bg-slate-900 hover:bg-slate-700",
      )}
    >
      <span
        className={cn(
          "size-[22px] bg-current [mask:var(--icon)_center/contain_no-repeat] [-webkit-mask:var(--icon)_center/contain_no-repeat]",
          variant === "detail" && "size-5",
        )}
        style={
          {
            "--icon": `url(${isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"})`,
          } as React.CSSProperties
        }
      />
      {variant === "detail" && label}
    </button>
  );
}
