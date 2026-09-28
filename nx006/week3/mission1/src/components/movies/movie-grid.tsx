import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
  showBookmark?: boolean
}

export function MovieGrid({ movies, onToggleBookmark, showBookmark }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-[18px] gap-y-[21px] min-[421px]:grid-cols-2 min-[701px]:grid-cols-3 min-[1101px]:grid-cols-5" aria-label="영화 목록">
      {movies.map(movie => (
        <li className="min-w-0" key={movie.id}>
          <MovieCard movie={movie} onToggleBookmark={onToggleBookmark} showBookmark={showBookmark} />
        </li>
      ))}
    </ul>
  )
}
