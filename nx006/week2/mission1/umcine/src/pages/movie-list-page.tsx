import { MovieGrid } from '../components/movie-grid'
import { Pagination } from '../components/pagination'
import type { Movie } from '../types/movie'

interface Props {
  movies: Movie[]
  onToggleBookmark: (id: number) => void
  currentPage: number
  onPageChange: (page: number) => void
}

export function MovieListPage({ movies, onToggleBookmark, currentPage, onPageChange }: Props) {
  // 원본 배열은 그대로 보존하고 Figma의 화면 순서(마지막 두 편)만 반영한다.
  const orderedMovies = [...movies].sort((a, b) => (a.id === 9 ? 10 : a.id === 10 ? 9 : a.id) - (b.id === 9 ? 10 : b.id === 10 ? 9 : b.id))
  return <main className="container movie-page" id="main-content">
    <h1>영화 목록</h1>
    <MovieGrid movies={orderedMovies} onToggleBookmark={onToggleBookmark} />
    <Pagination currentPage={currentPage} onPageChange={onPageChange} />
  </main>
}
