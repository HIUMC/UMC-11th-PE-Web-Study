import { useBookmarkStore } from '../../stores/bookmark-store'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

export function BookmarkIconButton({ movie }: { movie: Movie }) {
  const bookmarked = useBookmarkStore((state) => state.bookmarkedIds.includes(movie.id))
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  return (
    <button
      className={cn(
        'pointer-events-auto absolute top-2.5 right-2.5 grid size-9 cursor-pointer place-items-center rounded-lg border transition-[background-color,transform] duration-150 hover:-translate-y-px focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
        bookmarked
          ? 'border-[#2f67e8] bg-[#2f67e8]'
          : 'border-white/95 bg-[rgba(18,22,28,0.88)]',
      )}
      type="button"
      aria-label={`${movie.title} 북마크 ${bookmarked ? '해제' : '추가'}`}
      aria-pressed={bookmarked}
      onClick={() => toggleBookmark(movie.id)}
    >
      <img className="size-6 invert" src={bookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
    </button>
  )
}
