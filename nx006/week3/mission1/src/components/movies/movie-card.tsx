import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'
import { Icon } from '../icon'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
  showBookmark?: boolean
}

export function MovieCard({ movie, onToggleBookmark, showBookmark = true }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative rounded-[10px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={movie.title + ' 상세 보기'}><img className="aspect-[241.6/274] w-full rounded-[10px] object-cover min-[701px]:h-[274px]" src={movie.posterPath}
          alt={movie.title + ' 포스터'} loading="lazy" /></Link>
      {showBookmark && <button type="button" className={cn('absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-lg border border-white bg-[#17191e]', movie.isBookmarked && 'border-[#2563eb] bg-[#2563eb]')}
        aria-label={movie.title + ' 북마크'}
        aria-pressed={movie.isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}>
        <Icon name={movie.isBookmarked ? 'bookmark' : 'bookmark-outline'} />
      </button>}
      </div>
      <h2 className="mt-[9px] mb-1 truncate text-sm leading-[17px] font-extrabold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h2>
      <p className="text-xs leading-[14px] text-[#969da8]">{movie.releaseDate}</p>
    </article>
  )
}
