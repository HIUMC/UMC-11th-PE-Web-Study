import { useAuthStore } from '../../stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { useFavorites, useToggleFavorite } from '../../queries/member'
import type { TmdbMovie } from '../../api/movies/models'
import { cn } from '../../utils/cn'

export function BookmarkIconButton({ movie }: { movie: Pick<TmdbMovie, 'id' | 'title'> }) {
  const token = useAuthStore((state) => state.accessToken)
  const navigate = useNavigate()
  const favorites = useFavorites()
  const bookmarked = favorites.data?.some(({ movieId }) => movieId === movie.id) ?? false
  const toggle = useToggleFavorite(movie.id)

  return (
    <>
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
        disabled={toggle.isPending || Boolean(token && favorites.isPending)}
        onClick={() => {
          if (!token) void navigate({ to: '/login' })
          else if (favorites.isError) void favorites.refetch()
          else toggle.mutate(bookmarked)
        }}
      >
        <img className="size-6 invert" src={bookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
      </button>
      {(toggle.isError || favorites.isError) && <span className="absolute right-2 top-14 rounded bg-white px-2 py-1 text-xs text-red-700" role="status">즐겨찾기 오류 · 다시 시도</span>}
    </>
  )
}
