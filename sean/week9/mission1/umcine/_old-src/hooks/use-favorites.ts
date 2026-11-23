import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites } from "@/api/favorites/get-favorites";
import { getFavoriteStatus } from "@/api/favorites/get-favorite-status";
import { addFavorite } from "@/api/favorites/add-favorite";
import { removeFavorite } from "@/api/favorites/remove-favorite";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    staleTime: 60 * 1000,
  });
}

export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && enabled,
    staleTime: 60 * 1000,
  });
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 처리에 실패했어요. 다시 시도해 주세요.");
    },
  });
}