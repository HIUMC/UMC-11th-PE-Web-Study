import { useState } from 'react'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { useMovies } from '../../hooks/use-movies'
import { RequestStatus } from '../../components/movies/request-status'

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { movies, toggleBookmark, totalPages, isLoading, error, retry } = useMovies(currentPage)
  return (
    <main id="movie-list" className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-7 pb-16 sm:w-[calc(100%-64px)]">
      <h1 className="mb-5 text-3xl font-bold tracking-tighter sm:text-4xl">영화 목록</h1>
      <RequestStatus isLoading={isLoading} error={error} retry={retry} />
      {!isLoading && !error && <>
        {movies.length ? <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} /> : <p className="py-20 text-center text-gray-500">등록된 영화가 없어요.</p>}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </>}
    </main>
  )
}
