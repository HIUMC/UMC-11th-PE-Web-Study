import { createRootRoute } from '@tanstack/react-router'
import { NotFound, RootLayout } from '../components/layout/root-layout'
import { UmcineProvider } from '../hooks/umcine-context'

export const Route = createRootRoute({
  component: function RootRoute() { return <UmcineProvider><RootLayout /></UmcineProvider> },
  notFoundComponent: NotFound,
})
