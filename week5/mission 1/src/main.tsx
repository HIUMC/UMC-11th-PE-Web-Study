import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('example') === 'fetch') {
  void import('./examples/fetch-movies').then(({ runFetchMoviesExample }) => runFetchMoviesExample())
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
