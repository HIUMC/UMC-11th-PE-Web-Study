import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
}

export default function BookmarkButton({
  movieId,
  variant = "text",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={
        variant === "icon" ? "bookmark-button" : "bookmark-text-button"
      }
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      {variant === "icon" ? (
        <img
          src={
            isBookmarked
              ? "/icons/movie-icons/bookmark.svg"
              : "/icons/movie-icons/bookmark-outline.svg"
          }
          alt=""
        />
      ) : (
        isBookmarked ? "북마크 해제" : "북마크 추가"
      )}
    </button>
  );
}