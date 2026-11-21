import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/auth-store.ts'

export function clearPrivateCache(client: QueryClient) {
  const filters = { predicate: (query: { queryKey: readonly unknown[] }) => ['members', 'favorites', 'ratings'].includes(String(query.queryKey[0])) }
  // cancelQueries는 취소/revert를 즉시 수행한다. signal 무시 응답도 session 검사로 차단한다.
  void client.cancelQueries(filters)
  client.removeQueries(filters)
  client.getMutationCache().clear()
}
export function bindAuthLifecycle(client: QueryClient, invalidateRoutes: () => void = () => {}) {
  return useAuthStore.subscribe((state, previous) => {
    if (state.generation !== previous.generation || state.accessToken !== previous.accessToken) {
      clearPrivateCache(client)
      invalidateRoutes()
    }
  })
}
