import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
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
      alert("즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
