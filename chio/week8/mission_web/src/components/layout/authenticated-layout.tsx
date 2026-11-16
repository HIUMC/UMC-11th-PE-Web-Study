import { Navigate, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/auth-store'

export function AuthenticatedLayout() {
  const token = useAuthStore((state) => state.accessToken)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
