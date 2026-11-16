import { Link } from '@tanstack/react-router'
import type { TmdbMovieListItem } from '../../api/movies/models'
import { getTmdbPosterUrl } from '../../utils/movies/tmdb-image'
import { BookmarkIconButton } from './bookmark-icon-button'

interface MovieCardProps {
  movie: TmdbMovieListItem
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path)
  return (
    <article className="min-w-0">
      <div className="relative aspect-[246/278] w-full overflow-hidden rounded-[10px] bg-[#e4e7eb]">
        <Link className="block size-full focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${movie.title} 상세 보기`}>
          {posterUrl ? (
            <img className="block size-full object-cover" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <span className="grid size-full place-items-center text-sm text-[#727985]">이미지 없음</span>
          )}
        </Link>
        <BookmarkIconButton movie={movie} />
      </div>
      <h2 className="mt-2 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.35] font-bold tracking-[-0.35px] text-[#17191d]">
        <Link className="text-inherit no-underline hover:underline focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
      </h2>
      <p className="m-0 text-[13px] leading-[1.45] text-[#9aa1ac]">{movie.release_date?.replaceAll('-', '.') || '개봉일 미정'}</p>
    </article>
  )
}
