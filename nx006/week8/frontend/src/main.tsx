import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createAppQueryClient } from './config/query-client'
import { routeTree } from './routeTree.gen'
import { AUTH_STORE_KEY, useAuthStore } from './stores/auth-store'
import { bindAuthLifecycle } from './queries/auth-lifecycle'
import './index.css'

const router = createRouter({ routeTree })
const queryClient = createAppQueryClient()
bindAuthLifecycle(queryClient, () => { void router.invalidate() })
window.addEventListener('storage', event => {
  if (event.key === AUTH_STORE_KEY || event.key === null) void useAuthStore.persist.rehydrate()
})

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
