import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'
import { BookmarkButton } from './bookmark-button'
import { useDisplaySettingsStore } from '../../stores/display-settings-store'

interface MovieCardProps {
  movie: Movie
  showBookmark?: boolean
}

export function MovieCard({ movie, showBookmark = true }: MovieCardProps) {
  const cardSize = useDisplaySettingsStore(state => state.cardSize)
  return (
    <article className="min-w-0">
      <div className="relative rounded-[10px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={movie.title + ' 상세 보기'}><img className={cn('aspect-[241.6/274] w-full rounded-[10px] object-cover min-[701px]:h-[274px]', cardSize === 'compact' && 'aspect-square min-[701px]:h-[210px]')} src={movie.posterPath}
          alt={movie.title + ' 포스터'} loading="lazy" /></Link>
      {showBookmark && <BookmarkButton movieId={movie.id} title={movie.title} />}
      </div>
      <h2 className="mt-[9px] mb-1 truncate text-sm leading-[17px] font-extrabold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h2>
      <p className="text-xs leading-[14px] text-[#969da8]">{movie.releaseDate}</p>
    </article>
  )
}
