'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createAppQueryClient } from '../config/query-client'
import { AUTH_STORE_KEY, useAuthStore } from '../stores/auth-store'
import { useDisplaySettingsStore } from '../stores/display-settings-store'
import { useBookmarkStore } from '../stores/bookmark-store'
import { bindAuthLifecycle } from '../queries/auth-lifecycle'

import { AuthReadyContext } from '../hooks/use-auth-ready'

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(createAppQueryClient)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unbind = bindAuthLifecycle(client)
    const restoreAuth = () => useAuthStore.persist.rehydrate()
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORE_KEY || event.key === null) void restoreAuth()
    }
    let mounted = true

    window.addEventListener('storage', onStorage)
    void Promise.resolve(restoreAuth()).finally(() => {
      if (mounted) setAuthReady(true)
    })
    void useDisplaySettingsStore.persist.rehydrate()
    void useBookmarkStore.persist.rehydrate()

    return () => {
      mounted = false
      window.removeEventListener('storage', onStorage)
      unbind()
    }
  }, [client])

  return <QueryClientProvider client={client}>
    <AuthReadyContext.Provider value={authReady}>{children}</AuthReadyContext.Provider>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
}
