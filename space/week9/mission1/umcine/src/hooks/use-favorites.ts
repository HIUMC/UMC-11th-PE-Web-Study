import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorite, getFavorites, removeFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";
export function useFavorites() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({ queryKey: ["favorites", "list"], queryFn: ({ signal }) => getFavorites(signal), enabled: Boolean(token), retry: false });
}
export function useFavorite(movieId: number, enabled: boolean) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({ queryKey: ["favorites", "movie", movieId], queryFn: ({ signal }) => getFavorite(movieId, signal), enabled: Boolean(token) && enabled, retry: false });
}
export function useFavoriteMutation(movieId: number) {
  const client = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);
  return useMutation({
    mutationKey: ["favorites", movieId],
    mutationFn: async (isFavorite: boolean) => isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: async () => {
      if (token !== useAuthStore.getState().accessToken) return;
      await client.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

