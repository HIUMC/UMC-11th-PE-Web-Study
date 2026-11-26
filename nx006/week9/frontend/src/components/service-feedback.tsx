import type { UseQueryResult } from '@tanstack/react-query'
import { memberFailure } from '../api/members/member-api'

type Props = Pick<UseQueryResult<unknown>, 'isLoading' | 'isError' | 'isFetching' | 'error' | 'refetch' | 'fetchStatus'>
export function ServiceFeedback(query: Props) {
  if (query.isLoading) return <p className="py-5 text-sm text-[#606774]" role="status">정보를 불러오는 중이에요…</p>
  if (query.fetchStatus === 'paused') return <p className="py-5 text-sm" role="status">연결을 기다리고 있어요.</p>
  if (query.isError) return <div className="my-4 text-sm" role="alert"><p>{memberFailure(query.error).message}</p><button type="button" className="mt-2 rounded-lg border border-[#e3e6eb] bg-white px-3 py-2 disabled:opacity-40" disabled={query.isFetching} onClick={() => void query.refetch()}>다시 시도</button></div>
  return query.isFetching ? <p className="my-2 text-xs text-[#606774]" role="status">최신 정보를 확인하고 있어요…</p> : null
}
