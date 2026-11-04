import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { movies } from '../../data/movies'

export function MovieListPage() {
  return (
    <main className="bg-[#f5f6f8]">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1296px] pt-[25px] pb-[54px] max-[680px]:w-[calc(100%-32px)]">
        <h1 className="mt-0 mb-[23px] text-[36px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#15171b] max-[680px]:text-[30px]">영화 목록</h1>
        <MovieGrid
          movies={movies}
        />
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>
    </main>
  )
}
