import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/layout/header'
import { Footer } from '../components/layout/footer'
import { MovieProvider } from '../components/movies/movie-provider'

export const Route = createRootRoute({
  component: () => (
    <MovieProvider>
      <div className="flex min-h-dvh flex-col bg-[#f6f7f9] font-sans text-[#191b20]">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </MovieProvider>
  ),
  notFoundComponent: () => <main className="mx-auto flex-1 p-16">페이지를 찾을 수 없어요.</main>,
})
