import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite, deleteFavorite, type Favorite } from "../api/favorites";

export function useFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["favorites"] });
  return useMutation({
    mutationFn: (isFavorite: boolean) => isFavorite ? deleteFavorite(movieId) : createFavorite(movieId),
    onSuccess: async () => { await refresh(); },
  });
}

export function useFavoriteList() {
  return useQueryClient().getQueryData<Favorite[]>(["favorites"]);
}
