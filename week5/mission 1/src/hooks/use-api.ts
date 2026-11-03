import { useEffect, useState } from 'react'

export function useApi<T>(load: (signal: AbortSignal) => Promise<T>, enabled = true) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ load: typeof load; attempt: number; data?: T; error?: string }>()
  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setState({ load, attempt, data }) },
      () => { if (!controller.signal.aborted) setState({ load, attempt, error: '영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }) },
    )
    return () => controller.abort()
  }, [load, enabled, attempt])
  const current = enabled && state?.load === load && state.attempt === attempt ? state : undefined
  return { data: current?.data, error: current?.error, isLoading: enabled && !current, retry: () => setAttempt((value) => value + 1) }
}
