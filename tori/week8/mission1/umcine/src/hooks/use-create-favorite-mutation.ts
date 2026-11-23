import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFavorite } from "@/api/favorites/create-favorite";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,

    onSuccess: () => {
      // 마이페이지 즐겨찾기 목록을 다시 조회하도록 설정
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      alert("즐겨찾기에 추가했어요.");
    },

    onError: () => {
      alert("즐겨찾기 등록에 실패했어요.");
    },
  });
}