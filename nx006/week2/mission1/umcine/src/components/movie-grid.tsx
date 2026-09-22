import type { Movie } from '../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
  showBookmark?: boolean
}

export function MovieGrid({ movies, onToggleBookmark, showBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid" aria-label="영화 목록">
      {movies.map(movie => (
        <li key={movie.id}>
          <MovieCard movie={movie} onToggleBookmark={onToggleBookmark} showBookmark={showBookmark} />
        </li>
      ))}
    </ul>
  )
}
