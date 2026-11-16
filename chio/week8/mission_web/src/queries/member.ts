import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, updateMe } from '../api/members'
import { addFavorite, getFavorites, getFavoriteStatus, removeFavorite } from '../api/movie-records'
import { useAuthStore } from '../stores/auth-store'

export const meKey = ['members', 'me'] as const
export const favoritesKey = (token: string | null) => ['favorites', token] as const
export const ratingsKey = (token: string | null, memberId?: number) => ['ratings', token, memberId] as const

export function useMe() {
  const token = useAuthStore((state) => state.accessToken)
  return useQuery({
    queryKey: [...meKey, token],
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(token),
    retry: false,
  })
}

export function useUpdateMe() {
  const client = useQueryClient()
  const token = useAuthStore((state) => state.accessToken)
  return useMutation({
    mutationFn: updateMe,
    onSuccess: async (me) => {
      if (useAuthStore.getState().accessToken !== token) return
      await client.cancelQueries({ queryKey: [...meKey, token] })
      if (useAuthStore.getState().accessToken !== token) return
      client.setQueryData([...meKey, token], me)
    },
  })
}

export function useFavorites() {
  const token = useAuthStore((state) => state.accessToken)
  return useQuery({
    queryKey: favoritesKey(token),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(token),
  })
}

export function useFavoriteStatus(movieId: number) {
  const token = useAuthStore((state) => state.accessToken)
  return useQuery({
    queryKey: [...favoritesKey(token), movieId],
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(token),
  })
}

export function useToggleFavorite(movieId: number) {
  const token = useAuthStore((state) => state.accessToken)
  const client = useQueryClient()
  return useMutation({
    mutationFn: (isFavorite: boolean) => isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: () => client.invalidateQueries({ queryKey: favoritesKey(token) }),
  })
}
