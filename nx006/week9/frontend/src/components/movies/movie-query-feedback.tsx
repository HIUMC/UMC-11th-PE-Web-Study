import type { UseQueryResult } from '@tanstack/react-query'
import { requestFailure } from '../../utils/api-request'

type QueryFeedback = Pick<UseQueryResult<unknown>, 'data' | 'error' | 'isPending' | 'isLoading' | 'isFetching' | 'isError' | 'fetchStatus' | 'refetch'>

export function MovieQueryFeedback({ query, enabled = true, detail = false }: { query: QueryFeedback; enabled?: boolean; detail?: boolean }) {
  if (!enabled) return null
  const hasData = query.data !== undefined
  if (!hasData && query.isLoading) return <p className="py-16 text-center text-[#606774]" role="status">영화 정보를 불러오는 중이에요…</p>
  if (query.fetchStatus === 'paused') return <p className="py-6 text-center text-sm text-[#606774]" role="status">네트워크 연결을 기다리고 있어요.</p>
  if (!hasData && query.isPending) return <p className="py-16 text-center text-[#606774]" role="status">영화 정보를 준비하고 있어요…</p>
  const failure = requestFailure(query.error)
  const notFound = detail && failure.status === 404
  return <>
    {query.isError && <div className={hasData ? 'my-4 rounded-lg border border-[#e3e6eb] p-4 text-center' : 'py-16 text-center'} role="alert">
      {hasData && <p className="mb-2 text-sm text-[#606774]">최신 정보를 가져오지 못했어요. 이전 조회 결과를 표시합니다.</p>}
      <p className="leading-relaxed text-[#606774]">{notFound ? '영화를 찾을 수 없어요.' : failure.message}</p>
      {!notFound && <button type="button" disabled={query.isFetching} className="mt-4 rounded-lg bg-[#17191e] px-4 py-2 text-sm font-bold text-white disabled:opacity-40" onClick={() => { if (enabled && !query.isFetching) void query.refetch() }}>다시 시도</button>}
    </div>}
    {hasData && query.isFetching && <p className="my-3 text-center text-xs text-[#606774]" role="status">최신 영화 정보를 확인하는 중이에요…</p>}
  </>
}
