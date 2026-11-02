import { useState } from 'react'
import { checkEmail, checkNickname, getMemberRatings, type ApiResult } from '../api/movie-backend'

type RequestState = { status: 'idle' | 'loading' } | { status: 'success'; result: ApiResult<unknown> } | { status: 'error'; message: string }

function ApiForm({ title, label, initialValue, request }: { title: string; label: string; initialValue: string; request: (value: string) => Promise<ApiResult<unknown>> }) {
  const [value, setValue] = useState(initialValue)
  const [state, setState] = useState<RequestState>({ status: 'idle' })
  return <section className="rounded-xl border border-[#e3e6eb] bg-white p-5">
    <h2 className="mb-4 text-lg font-bold">{title}</h2>
    <form className="flex flex-wrap items-end gap-3" onSubmit={event => {
      event.preventDefault()
      setState({ status: 'loading' })
      void request(value).then(result => setState({ status: 'success', result })).catch((error: unknown) => setState({ status: 'error', message: error instanceof Error ? error.message : '연결에 실패했습니다.' }))
    }}>
      <label className="flex flex-1 flex-col gap-2 text-sm font-bold">{label}<input className="rounded-lg border border-[#e3e6eb] px-3 py-2 font-normal" value={value} onChange={event => { setValue(event.target.value); setState({ status: 'idle' }) }} disabled={state.status === 'loading'} required /></label>
      <button className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={state.status === 'loading'} type="submit">{state.status === 'loading' ? '조회 중…' : title}</button>
    </form>
    <div className="mt-4" aria-live="polite">
      {state.status === 'idle' && <p className="text-sm text-[#606774]">입력 후 버튼을 눌러 확인하세요.</p>}
      {state.status === 'loading' && <p>조회 중입니다.</p>}
      {state.status === 'error' && <p className="text-sm text-[#d92d20]" role="alert">{state.message}</p>}
      {state.status === 'success' && <><p className="text-sm font-bold text-[#18794e]">성공 · HTTP {state.result.status}</p><p className="mt-2 break-all text-xs text-[#606774]">{state.result.url}</p><pre className="mt-3 overflow-auto rounded-lg bg-[#f6f7f9] p-3 text-xs">{JSON.stringify(state.result.data, null, 2)}</pre></>}
    </div>
  </section>
}

export function MemberApiPage() {
  return <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10">
    <h1 className="text-3xl font-bold">회원 · 평점 조회</h1>
    <p className="my-5 text-sm text-[#606774]">닉네임과 이메일 사용 가능 여부, 회원별 영화 평점을 확인하세요. 중복 확인 결과는 해당 값을 예약하지 않습니다.</p>
    <div className="grid items-start gap-5 md:grid-cols-3">
      <ApiForm title="닉네임 확인" label="닉네임" initialValue="수현" request={checkNickname} />
      <ApiForm title="이메일 확인" label="이메일" initialValue="noco@umc.com" request={checkEmail} />
      <ApiForm title="평점 조회" label="회원 ID" initialValue="1" request={getMemberRatings} />
    </div>
  </main>
}
