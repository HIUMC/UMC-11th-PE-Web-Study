import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import type { Movie } from '../../types/movie'

interface Props {
  movies: Movie[]
  onToggleBookmark: (id: number) => void
  currentPage: number
  onPageChange: (page: number) => void
}

export function MovieListPage({ movies, onToggleBookmark, currentPage, onPageChange }: Props) {
  // 원본 배열은 그대로 보존하고 Figma의 화면 순서(마지막 두 편)만 반영한다.
  const orderedMovies = [...movies].sort((a, b) => (a.id === 9 ? 10 : a.id === 10 ? 9 : a.id) - (b.id === 9 ? 10 : b.id === 10 ? 9 : b.id))
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-6 md:px-8 xl:px-20" id="main-content">
    <h1 className="mb-5 text-[32px] leading-10 font-bold tracking-[-1.7px] min-[701px]:text-[38px] min-[701px]:leading-[44px]">영화 목록</h1>
    <MovieGrid movies={orderedMovies} onToggleBookmark={onToggleBookmark} />
    <Pagination currentPage={currentPage} onPageChange={onPageChange} />
  </main>
}
