import { QueryClient } from '@tanstack/react-query'
import { isHTTPError } from 'ky'
import { TmdbConfigError } from './env.ts'
import { TmdbResponseError } from '../api/movies/validate-response.ts'

export function retryMovieRequest(failureCount: number, error: Error): boolean {
  if (failureCount >= 1 || error instanceof TmdbConfigError || error instanceof TmdbResponseError) return false
  if (isHTTPError(error)) return error.response.status >= 500 || [408, 429].includes(error.response.status)
  return error.name !== 'AbortError'
}

// 앱에는 한 인스턴스만 연결한다. 테스트는 factory로 별도 캐시를 만든다.
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: retryMovieRequest,
      retryDelay: 1_000,
    } },
  })
}
