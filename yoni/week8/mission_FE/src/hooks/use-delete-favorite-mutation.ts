import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "../api/favorites/delete-favorite";

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["members", "favorites"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["members", "favorite-status"],
        }),
      ]);
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
