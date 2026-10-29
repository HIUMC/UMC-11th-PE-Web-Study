import { useBookmarkStore } from '../../stores/bookmark-store'
import { cn } from '../../utils/cn'
import { Icon } from '../icon'

interface Props { movieId: number; title: string; variant?: 'card' | 'detail' | 'search' }

export function BookmarkButton({ movieId, title, variant = 'card' }: Props) {
  const isBookmarked = useBookmarkStore(state => state.bookmarkedMovieIds.includes(movieId))
  const toggleBookmark = useBookmarkStore(state => state.toggleBookmark)
  return <button type="button" aria-label={`${title} 북마크`} aria-pressed={isBookmarked} onClick={() => toggleBookmark(movieId)}
    className={cn(
      variant === 'card' && 'absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-lg border border-white bg-[#17191e]',
      variant === 'card' && isBookmarked && 'border-[#2563eb] bg-[#2563eb]',
      variant === 'detail' && 'inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white',
      variant === 'search' && 'inline-flex items-center gap-1 rounded-md border border-[#e3e6eb] bg-[#17191e] px-2 py-1 text-xs font-bold text-white',
      variant === 'search' && isBookmarked && 'border-[#2563eb] bg-[#2563eb]',
    )}>
    <Icon name={variant === 'detail' ? 'detail-bookmark' : isBookmarked ? 'bookmark' : 'bookmark-outline'} />
    {variant !== 'card' && (isBookmarked ? '즐겨찾기 해제' : '즐겨찾기')}
  </button>
}
