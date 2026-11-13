import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white transition-colors duration-200 ease-in-out",
        isBookmarked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "bg-[#17191E] hover:bg-[#0f172a]",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt="북마크"
        className="h-6 w-6 brightness-0 invert filter"
      />
    </button>
  );
}
