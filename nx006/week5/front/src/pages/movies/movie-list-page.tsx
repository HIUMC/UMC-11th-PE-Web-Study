import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { useCallback, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { isMovieSort, useDisplaySettingsStore } from '../../stores/display-settings-store'
import { sortMovies } from '../../utils/sort-movies'
import { getMovies } from '../../api/movies/get-movies'
import { useApiRequest } from '../../hooks/use-api-request'
import { toMovieCard } from '../../utils/movies/tmdb-adapter'
import { moviePageCount } from '../../utils/movie-params'
import { RequestFeedback } from '../../components/movies/request-feedback'

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const request = useCallback((signal: AbortSignal) => getMovies({ page, signal }), [page])
  const { state, retry } = useApiRequest(`popular:${page}`, request)
  useEffect(() => {
    if (state.status === 'success' && state.data.total_pages > 0 && page > moviePageCount(state.data.total_pages)) {
      navigate({ search: { page: moviePageCount(state.data.total_pages) }, replace: true })
    }
  }, [state, page, navigate])
  const cardSize = useDisplaySettingsStore(state => state.cardSize)
  const setCardSize = useDisplaySettingsStore(state => state.setCardSize)
  const movieSort = useDisplaySettingsStore(state => state.movieSort)
  const setMovieSort = useDisplaySettingsStore(state => state.setMovieSort)
  const orderedMovies = state.status === 'success' ? sortMovies(state.data.results.map(toMovieCard), movieSort) : []
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-6 md:px-8 xl:px-20" id="main-content">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-[32px] leading-10 font-bold tracking-[-1.7px] min-[701px]:text-[38px] min-[701px]:leading-[44px]">영화 목록</h1>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-bold text-[#606774]">카드 크기<select className="rounded-lg border border-[#e3e6eb] bg-white px-3 py-2" value={cardSize} onChange={event => { if (event.target.value === 'standard' || event.target.value === 'compact') setCardSize(event.target.value) }}><option value="standard">기본</option><option value="compact">작게</option></select></label>
        <label className="flex items-center gap-2 text-xs font-bold text-[#606774]">정렬<select className="rounded-lg border border-[#e3e6eb] bg-white px-3 py-2" value={movieSort} onChange={event => { if (isMovieSort(event.target.value)) setMovieSort(event.target.value) }}><option value="default">기본 순서</option><option value="release-desc">최신 개봉순</option><option value="release-asc">오래된 개봉순</option><option value="title-asc">제목순</option></select></label>
      </div>
    </div>
    <RequestFeedback state={state} retry={retry} />
    {state.status === 'success' && <>
      <p className="mb-5 text-xs text-[#969da8]">인기 영화 · {state.data.total_results.toLocaleString()}편 · {page}페이지 · 정렬은 현재 페이지에 적용됩니다.</p>
      {orderedMovies.length ? <MovieGrid movies={orderedMovies} /> : <p className="py-16 text-center text-[#606774]" role="status">표시할 영화가 없어요.</p>}
      {state.data.total_pages > 0 && <Pagination currentPage={page} totalPages={moviePageCount(state.data.total_pages)} onPageChange={next => { navigate({ search: { page: next } }) }} />}
    </>}
  </main>
}
