import { isHTTPError } from 'ky'
import { TmdbConfigError } from '../config/env.ts'
import { TmdbResponseError } from '../api/movies/validate-response.ts'
import { FetchHttpError } from '../api/movies/get-movies-with-fetch.ts'
export interface RequestFailure { message: string; status?: number }
export type RequestState<T> = { status: 'idle' | 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: RequestFailure }
export function requestFailure(error: unknown): RequestFailure {
  if (error instanceof TmdbConfigError || error instanceof TmdbResponseError) return { message: error.message }
  if (error instanceof FetchHttpError) return { message: error.message, status: error.status }
  if (isHTTPError(error)) return {
    status: error.response.status,
    message: error.response.status === 401 || error.response.status === 403 ? 'TMDB 인증에 실패했어요. 로컬 토큰 설정을 확인해 주세요.' : '영화 정보를 불러오지 못했어요. 다시 시도해 주세요.',
  }
  return { message: '영화 정보를 불러오지 못했어요. 네트워크 연결을 확인하고 다시 시도해 주세요.' }
}
// 실제 effect의 수명 처리. 취소를 무시하는 요청도 active guard로 막는다.
export function runApiRequest<T>(request: (signal: AbortSignal) => Promise<T>, publish: (state: RequestState<T>) => void): () => void {
  const controller = new AbortController()
  let active = true
  publish({ status: 'loading' })
  Promise.resolve().then(() => active ? request(controller.signal) : undefined).then(data => {
    if (active && !controller.signal.aborted) publish({ status: 'success', data: data as T })
  }).catch((error: unknown) => {
    if (active && !controller.signal.aborted) publish({ status: 'error', error: requestFailure(error) })
  })
  return () => { active = false; controller.abort() }
}
