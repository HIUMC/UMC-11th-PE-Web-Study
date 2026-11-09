import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-white bg-gray-900",
        isBookmarked && "border-primary bg-primary",
      )}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleBookmark(movieId);
      }}
    >
      <img
        className="h-[18px] w-[18px] brightness-0 invert"
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}