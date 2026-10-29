import { useCallback, useState } from 'react'
import { isHTTPError } from 'ky'
import { useBookmarkStore } from '../../stores/bookmark-store'
import { useApiRequest } from '../../hooks/use-api-request'
import { getMovieDetail } from '../../api/movies/get-movie-detail'
import { toMovieDetail } from '../../utils/movies/tmdb-adapter'
import { MovieGrid } from './movie-grid'
import { Pagination } from './pagination'
import { RequestFeedback } from './request-feedback'

export function BookmarkShelf() {
  const ids = useBookmarkStore(state => state.bookmarkedMovieIds)
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(ids.length / 5))
  const safePage = Math.min(page, totalPages)
  const pageIds = ids.slice((safePage - 1) * 5, safePage * 5)
  const key = pageIds.join(',')
  const request = useCallback(async (signal: AbortSignal) => {
    const results = await Promise.allSettled(key.split(',').map(id => getMovieDetail(Number(id), signal)))
    const movies = results.flatMap(result => result.status === 'fulfilled' ? [toMovieDetail(result.value)] : [])
    const failures = results.filter(result => result.status === 'rejected' && !(isHTTPError(result.reason) && result.reason.response.status === 404))
    if (failures.length) throw (failures[0] as PromiseRejectedResult).reason
    return { movies, missing: results.length - movies.length }
  }, [key])
  const { state, retry } = useApiRequest(key || null, request)
  return <>
    {!ids.length && <p className="py-16 text-center text-[#606774]">아직 즐겨찾기한 영화가 없어요. 영화 목록에서 북마크를 눌러 보세요.</p>}
    <RequestFeedback state={state} retry={retry} />
    {state.status === 'success' && <>{state.data.missing > 0 && <p className="mb-4 text-sm text-[#606774]">이 페이지의 저장된 ID {state.data.missing}개는 TMDB에서 찾을 수 없어요. 저장값은 유지했습니다.</p>}<MovieGrid movies={state.data.movies} showBookmark={false} /></>}
    {ids.length > 0 && <Pagination currentPage={safePage} totalPages={totalPages} disabled={state.status === 'loading'} onPageChange={setPage} />}
  </>
}
