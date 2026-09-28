import { createFileRoute } from '@tanstack/react-router'
import { useUmcineContext } from '../hooks/umcine-store'
import { MovieListPage } from '../pages/movies/movie-list-page'

export const Route = createFileRoute('/')({ component: function ListRoute() {
  const { movies, currentPage, setCurrentPage, toggleBookmark } = useUmcineContext()
  return <MovieListPage movies={movies.filter(movie => movie.id <= 10)} currentPage={currentPage} onPageChange={setCurrentPage} onToggleBookmark={toggleBookmark} />
} })
