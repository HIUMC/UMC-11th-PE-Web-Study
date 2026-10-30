import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="min-w-0">
      <div className="relative aspect-[242/276] overflow-hidden rounded-lg bg-gray-200">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={movie.title} className="block h-full">
          <img className="h-full w-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button type="button" className={cn('absolute right-2 top-2 grid h-9 w-[34px] place-items-center rounded-md border text-white transition-colors motion-reduce:transition-none', movie.isBookmarked ? 'border-[#4f60ee] bg-[#4f60ee] hover:bg-[#4050d4]' : 'border-white/70 bg-black/60 hover:bg-gray-700')}
          onClick={() => onToggleBookmark(movie.id)} aria-label={`${movie.title} 북마크`} aria-pressed={movie.isBookmarked} title={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}>
          <img className="invert" src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" width={24} height={24} />
        </button>
      </div>
      <h2 className="mt-2 text-sm leading-snug font-bold tracking-tight"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h2>
      <time className="mt-0.5 block text-xs text-gray-400" dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time>
    </li>
  )
}
