"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { favoriteQueries } from "../api/favorites/favorite-queries";

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
      // 이미 해제된 경우(404) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}
