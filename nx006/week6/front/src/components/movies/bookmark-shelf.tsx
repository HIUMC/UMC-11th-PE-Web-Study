import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { isHTTPError } from 'ky'
import { useBookmarkStore } from '../../stores/bookmark-store'
import { movieDetailOptions } from '../../queries/movie-queries'
import { toMovieDetail } from '../../utils/movies/tmdb-adapter'
import { MovieGrid } from './movie-grid'
import { Pagination } from './pagination'
import { MovieQueryFeedback } from './movie-query-feedback'

export function BookmarkShelf() {
  const ids = useBookmarkStore(state => state.bookmarkedMovieIds)
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(ids.length / 5))
  const safePage = Math.min(page, totalPages)
  const pageIds = ids.slice((safePage - 1) * 5, safePage * 5)
  // 상세 화면과 같은 query key로 캐시 및 진행 중인 요청을 공유한다.
  const queries = useQueries({ queries: pageIds.map(id => movieDetailOptions(id)) })
  const movies = queries.flatMap(query => query.data ? [toMovieDetail(query.data)] : [])
  const isMissing = (error: unknown) => isHTTPError(error) && error.response.status === 404
  const missing = queries.filter(query => !query.data && isMissing(query.error)).length
  const isLoading = queries.some(query => query.isLoading)
  return <>
    {!ids.length && <p className="py-16 text-center text-[#606774]">아직 즐겨찾기한 영화가 없어요. 영화 목록에서 북마크를 눌러 보세요.</p>}
    {isLoading && !movies.length && <p className="py-16 text-center text-[#606774]" role="status">영화 정보를 불러오는 중이에요…</p>}
    {queries.map((query, index) => (query.isError && !isMissing(query.error)) || query.fetchStatus === 'paused'
      ? <MovieQueryFeedback key={pageIds[index]} query={query} /> : null)}
    {missing > 0 && <p className="mb-4 text-sm text-[#606774]">이 페이지의 저장된 ID {missing}개는 TMDB에서 찾을 수 없어요. 저장값은 유지했습니다.</p>}
    {movies.length > 0 && <MovieGrid movies={movies} showBookmark={false} />}
    {movies.length > 0 && queries.some(query => query.isFetching) && <p className="my-3 text-xs text-[#606774]" role="status">즐겨찾기의 최신 정보를 확인하는 중이에요…</p>}
    {ids.length > 0 && <Pagination currentPage={safePage} totalPages={totalPages} disabled={isLoading} onPageChange={setPage} />}
  </>
}
