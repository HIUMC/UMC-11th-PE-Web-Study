import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
}
export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return <ul className="grid grid-cols-2 gap-x-3 gap-y-5 min-[480px]:grid-cols-3 min-[720px]:grid-cols-4 min-[1000px]:grid-cols-5 sm:gap-x-[18px]" aria-label="영화 목록">
    {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />)}
  </ul>
}
