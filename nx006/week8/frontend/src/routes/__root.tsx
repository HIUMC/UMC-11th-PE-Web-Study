import { createRootRoute } from '@tanstack/react-router'
import { NotFound, RootLayout } from '../components/layout/root-layout'

export const Route = createRootRoute({
  component: function RootRoute() { return <RootLayout /> },
  notFoundComponent: NotFound,
})
