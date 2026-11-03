import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { getMovies } from '../../api/movies/get-movies'
import { useBookmarkStore } from '../../stores/bookmark-store'
import { toMovie } from '../../utils/movies/to-movie'
import { RequestStatus } from '../../components/movies/request-status'

export function MovieListPage() {
  const [page, setPage] = useState(1)
  const moviesQuery = useQuery({
    queryKey: ['movies', 'list', { page }],
    queryFn: ({ signal }) => getMovies({ page }, signal),
  })
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds)
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)
  const movies = (moviesQuery.data?.results ?? []).map((movie) => toMovie(movie, bookmarkedMovieIds.includes(movie.id)))
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500)

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  return (
    <main id="movie-list" className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-7 pb-16 sm:w-[calc(100%-64px)]">
      <h1 className="mb-5 text-3xl font-bold tracking-tighter sm:text-4xl">영화 목록</h1>
      {moviesQuery.isPending ? (
        <p role="status" className="py-20 text-center text-gray-500">영화를 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <RequestStatus isLoading={false} error={moviesQuery.error.message} retry={() => { void moviesQuery.refetch() }} />
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-gray-500">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  )
}
