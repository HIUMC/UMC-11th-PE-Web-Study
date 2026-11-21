import { useEffect, useRef, useState } from 'react'
import { runApiRequest, type RequestState } from '../utils/api-request.ts'

export function useApiRequest<T>(key: string | null, request: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0)
  const [snapshot, setSnapshot] = useState<{ key: string | null; attempt: number; state: RequestState<T> }>({ key: null, attempt: 0, state: { status: 'idle' } })
  const retryPending = useRef(false)
  const state: RequestState<T> = key === null ? { status: 'idle' } : snapshot.key === key && snapshot.attempt === attempt ? snapshot.state : { status: 'loading' }
  useEffect(() => {
    retryPending.current = false
    if (key === null) return
    return runApiRequest(request, state => setSnapshot({ key, attempt, state }))
  }, [key, request, attempt])
  function retry() {
    if (state.status !== 'error' || retryPending.current) return
    retryPending.current = true
    setAttempt(value => value + 1)
  }
  return { state, retry }
}
