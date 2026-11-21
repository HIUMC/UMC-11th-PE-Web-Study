import { useAuthStore } from '../stores/auth-store'
export function useAuthSession() {
  const accessToken = useAuthStore(state => state.accessToken)
  const generation = useAuthStore(state => state.generation)
  return { accessToken, generation }
}
