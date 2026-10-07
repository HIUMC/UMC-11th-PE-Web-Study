import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import type { Movie } from '../../types/movie'
import { useDisplaySettingsStore } from '../../stores/display-settings-store'

interface Props {
  movies: Movie[]
  currentPage: number
  onPageChange: (page: number) => void
}

export function MovieListPage({ movies, currentPage, onPageChange }: Props) {
  const cardSize = useDisplaySettingsStore(state => state.cardSize)
  const setCardSize = useDisplaySettingsStore(state => state.setCardSize)
  // 원본 배열은 그대로 보존하고 Figma의 화면 순서(마지막 두 편)만 반영한다.
  const orderedMovies = [...movies].sort((a, b) => (a.id === 9 ? 10 : a.id === 10 ? 9 : a.id) - (b.id === 9 ? 10 : b.id === 10 ? 9 : b.id))
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-6 md:px-8 xl:px-20" id="main-content">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-[32px] leading-10 font-bold tracking-[-1.7px] min-[701px]:text-[38px] min-[701px]:leading-[44px]">영화 목록</h1>
      <label className="flex items-center gap-2 text-xs font-bold text-[#606774]">카드 크기<select className="rounded-lg border border-[#e3e6eb] bg-white px-3 py-2" value={cardSize} onChange={event => { if (event.target.value === 'standard' || event.target.value === 'compact') setCardSize(event.target.value) }}><option value="standard">기본</option><option value="compact">작게</option></select></label>
    </div>
    <MovieGrid movies={orderedMovies} />
    <Pagination currentPage={currentPage} onPageChange={onPageChange} />
  </main>
}
