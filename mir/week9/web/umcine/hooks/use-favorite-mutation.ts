import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  type FavoriteStatus,
} from "../api/favorites/favorites";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: (_response, movieId) => {
      queryClient.setQueryData<FavoriteStatus>(["favorites", movieId], {
        isFavorite: true,
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: (_response, movieId) => {
      queryClient.setQueryData<FavoriteStatus>(["favorites", movieId], {
        isFavorite: false,
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
