import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="grid grid-cols-5 gap-x-4 gap-y-5 max-[1050px]:grid-cols-3 max-[680px]:grid-cols-2" id="movies" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </section>
  )
}
