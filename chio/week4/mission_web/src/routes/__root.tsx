import { createRootRoute } from '@tanstack/react-router'
import { AppLayout } from '../components/layout/app-layout'

export const Route = createRootRoute({
  component: AppLayout,
  notFoundComponent: () => (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1296px] py-[25px] max-[680px]:w-[calc(100%-32px)]">
      <h1 className="text-3xl font-extrabold">페이지를 찾을 수 없어요.</h1>
    </main>
  ),
})
