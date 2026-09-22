import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function useRoute() {
  const route = useSyncExternalStore(subscribe, () => window.location.hash.slice(1) || '/')
  const url = new URL(route, window.location.origin)
  return { path: url.pathname, query: url.searchParams.get('q') ?? '' }
}

export function navigate(path: string) {
  window.location.hash = path
  window.scrollTo(0, 0)
}
