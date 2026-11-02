import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../pages/auth-page'
import { useUmcineContext } from '../hooks/umcine-store'

export const Route = createFileRoute('/login')({ component: function LoginRoute() {
  const { available, authenticate } = useUmcineContext()
  return <AuthPage signup={false} checkAvailable={available} onSubmit={(profile, password) => authenticate(profile, password, false)} />
} })
