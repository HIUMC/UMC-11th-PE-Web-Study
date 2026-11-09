import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`

  return (
    <article className="min-w-0">
      <div className="relative aspect-[246/278] w-full overflow-hidden rounded-[10px] bg-[#e4e7eb]">
        <Link className="block size-full focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${movie.title} 상세 보기`}>
          <img className="block size-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          className={cn(
            'absolute top-2.5 right-2.5 grid size-9 cursor-pointer place-items-center rounded-lg border transition-[background-color,transform] duration-150 hover:-translate-y-px focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
            movie.isBookmarked
              ? 'border-[#2f67e8] bg-[#2f67e8]'
              : 'border-white/95 bg-[rgba(18,22,28,0.88)]',
          )}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img className="size-6 invert"
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>
      <h2 className="mt-2 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.35] font-bold tracking-[-0.35px] text-[#17191d]">
        <Link className="text-inherit no-underline hover:underline focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
      </h2>
      <p className="m-0 text-[13px] leading-[1.45] text-[#9aa1ac]">{movie.releaseDate}</p>
    </article>
  )
}
