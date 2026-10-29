import type { RequestState } from '../../utils/api-request'
export function RequestFeedback({ state, retry, detail = false }: { state: RequestState<unknown>; retry: () => void; detail?: boolean }) {
  if (state.status === 'loading') return <p className="py-16 text-center text-[#606774]" role="status">영화 정보를 불러오는 중이에요…</p>
  if (state.status !== 'error') return null
  const notFound = detail && state.error.status === 404
  return <div className="py-16 text-center" role="alert"><p className="leading-relaxed text-[#606774]">{notFound ? '영화를 찾을 수 없어요.' : state.error.message}</p>
    {!notFound && <button type="button" className="mt-4 rounded-lg bg-[#17191e] px-4 py-2 text-sm font-bold text-white" onClick={retry}>다시 시도</button>}
  </div>
}
