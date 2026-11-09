import { useState } from 'react'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { useMovies } from '../../hooks/use-movies'

const pageSize = 10
export function MovieListPage() {
  const { movies, toggleBookmark } = useMovies()
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <main id="movie-list" className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-7 pb-16 sm:w-[calc(100%-64px)]">
      <h1 className="mb-5 text-3xl font-bold tracking-tighter sm:text-4xl">영화 목록</h1>
      <MovieGrid movies={movies.slice((currentPage - 1) * pageSize, currentPage * pageSize)} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={currentPage} totalPages={Math.ceil(movies.length / pageSize)} onPageChange={setCurrentPage} />
    </main>
  )
}
