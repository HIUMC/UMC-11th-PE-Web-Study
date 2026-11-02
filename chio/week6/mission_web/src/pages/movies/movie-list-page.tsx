import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { movieQueries } from '../../queries/movies'
import { QueryStatus } from '../../components/movies/query-status'

export function MovieListPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useQuery(movieQueries.popular(page))

  return (
    <main className="bg-[#f5f6f8]">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1296px] pt-[25px] pb-[54px] max-[680px]:w-[calc(100%-32px)]">
        <h1 className="mt-0 mb-[23px] text-[36px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#15171b] max-[680px]:text-[30px]">영화 목록</h1>
        {isPending ? <QueryStatus /> : isError ? <QueryStatus error={error} onRetry={() => { void refetch() }} /> : (
          <>
            {data.results.length ? <MovieGrid movies={data.results} /> : <p>등록된 영화가 없어요.</p>}
            <Pagination currentPage={page} totalPages={Math.min(data.total_pages, 500)} onPageChange={setPage} />
          </>
        )}
      </div>
    </main>
  )
}
