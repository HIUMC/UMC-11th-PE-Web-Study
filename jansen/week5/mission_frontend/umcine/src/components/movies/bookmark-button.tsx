import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { BookmarkIcon } from "../icons";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "flex size-[34px] cursor-pointer items-center justify-center rounded-lg border-2 text-white",
        isBookmarked ? "border-brand bg-brand" : "border-white bg-black/40",
        className,
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => toggleBookmark(movieId)}
    >
      <BookmarkIcon className="size-4" filled={isBookmarked} />
    </button>
  );
}