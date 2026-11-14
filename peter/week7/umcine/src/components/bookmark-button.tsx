import { cn } from "../utils/cn";
import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "detail";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const buttonLabel = isBookmarked
    ? "북마크 해제"
    : "북마크 추가";

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-label={buttonLabel}
      aria-pressed={isBookmarked}
      className={cn(
        "flex items-center justify-center border text-white",

        variant === "card" &&
          "absolute top-2 right-2 h-[34px] w-[34px] rounded-lg p-0",

        variant === "detail" &&
          "h-[42px] w-[107px] gap-2 rounded-lg border-white bg-[#2563eb] px-4",

        variant === "card" &&
          (isBookmarked
            ? "border-blue-600 bg-blue-600"
            : "border-white bg-black/60"),
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className={cn(
          "block shrink-0 brightness-0 invert",
          variant === "card" ? "h-6 w-6" : "h-4 w-4",
        )}
      />

      <span
        className={cn(
          variant === "card" && "sr-only",
          variant === "detail" &&
            "text-center text-sm leading-none font-extrabold whitespace-nowrap",
        )}
      >
        {variant === "detail" ? "즐겨찾기" : buttonLabel}
      </span>
    </button>
  );
}