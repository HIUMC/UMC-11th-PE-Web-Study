import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isHTTPError } from 'ky'
import { useAuthStore } from './stores/auth-store'
import './index.css'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (isHTTPError(error) && error.response.status >= 400 && error.response.status < 500) return false
        return failureCount < 1
      },
    },
  },
})

useAuthStore.subscribe(({ accessToken }, previous) => {
  if (!previous.accessToken || accessToken === previous.accessToken) return
  const oldToken = previous.accessToken
  queryClient.removeQueries({
    predicate: ({ queryKey }) => queryKey[0] === 'members'
      ? queryKey[1] === 'me' && queryKey[2] === oldToken
      : ['favorites', 'ratings'].includes(String(queryKey[0])) && queryKey[1] === oldToken,
  })
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
