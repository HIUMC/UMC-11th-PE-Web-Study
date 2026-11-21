import { useCallback, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { getMoviesWithFetch } from '../api/movies/get-movies-with-fetch'
import { loadWithAsyncAwait, loadWithThen } from '../examples/promise-practice'
import { useApiRequest } from '../hooks/use-api-request'
import { RequestFeedback } from '../components/movies/request-feedback'
export function ApiLabPage() {
  const [run, setRun] = useState({ attempt: 0, syntax: 'then' })
  const { syntax } = run
  const request = useCallback((signal: AbortSignal) => (syntax === 'then' ? loadWithThen : loadWithAsyncAwait)(() => getMoviesWithFetch(1, signal)), [syntax])
  const { state, retry } = useApiRequest(run.attempt ? `${run.syntax}:${run.attempt}` : null, request)
  return <main id="main-content" className="mx-auto w-full max-w-[950px] flex-1 px-5 py-10"><h1 className="text-3xl font-bold">순수 fetch 실습</h1><p className="my-5 text-sm text-[#606774]">버튼을 눌렀을 때만 인기 영화 1페이지를 요청합니다. Network에서 URL·query·status·Response를 확인하세요. Authorization 토큰은 캡처에 포함하지 마세요.</p>
    <div className="flex flex-wrap gap-3">{['then', 'await'].map(syntax => <button key={syntax} type="button" className="rounded-lg border border-[#e3e6eb] bg-white px-4 py-3 text-sm font-bold disabled:opacity-40" disabled={state.status === 'loading'} onClick={() => setRun({ attempt: run.attempt + 1, syntax })}>{syntax === 'then' ? 'fetch · then/catch' : 'fetch · async/await'}</button>)}<Link className="p-3 text-[#2563eb]" to="/">영화 목록</Link></div>
    <RequestFeedback state={state} retry={retry} />
    {state.status === 'success' && <section className="mt-6"><h2 className="text-lg font-bold">fulfilled · {state.data.results.length}편 · {state.data.page}페이지</h2><pre className="mt-4 overflow-auto rounded-lg bg-white p-4 text-xs">{JSON.stringify(state.data, null, 2)}</pre></section>}
  </main>
}
