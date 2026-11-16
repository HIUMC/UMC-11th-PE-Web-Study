import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorites } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

const favoritesQueryKey = ["favorites"] as const;

export function useFavorites() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoritesQueryKey,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) =>
      isFavorite ? deleteFavorite(movieId) : addFavorite(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoritesQueryKey }),
  });
}
