import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export default function BookmarkButton({ movieId, movieTitle, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return <button className={cn("inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700", className)} type="button" aria-label={isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크 추가`} aria-pressed={isBookmarked} onClick={() => toggleBookmark(movieId)}>{isBookmarked ? "북마크 해제" : "북마크 추가"}</button>;
}
