import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../pages/auth-page'
import { useUmcineContext } from '../hooks/umcine-store'

export const Route = createFileRoute('/signup')({ component: function SignupRoute() {
  const { available, authenticate } = useUmcineContext()
  return <AuthPage signup checkAvailable={available} onSubmit={(profile, password) => authenticate(profile, password, true)} />
} })
