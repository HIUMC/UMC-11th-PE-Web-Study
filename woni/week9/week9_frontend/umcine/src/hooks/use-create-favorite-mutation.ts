"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { favoriteQueries } from "../api/favorites/favorite-queries";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    // 목록과 영화별 여부를 모두 다시 받아 옴
    // Promise를 반환해서 다시 받아 오는 동안에도 isPending이 유지되게 함
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: favoriteQueries.all() }),
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
      // 이미 등록된 경우(409) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey: favoriteQueries.all() });
    },
  });
}
