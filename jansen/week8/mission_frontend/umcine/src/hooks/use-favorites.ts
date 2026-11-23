import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "@/api/favorites/favorites";
import { useAuthStore } from "@/stores/auth-store";
import { getErrorMessage } from "@/utils/get-error-message";

// 내 즐겨찾기 목록 (마이페이지)
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

// 특정 영화의 즐겨찾기 여부 (영화 상세)
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && movieId > 0,
  });
}

// 즐겨찾기 추가/해제 토글
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await removeFavorite(movieId);
      else await addFavorite(movieId);
    },
    onSuccess: (_, wasFavorite) => {
      // 서버 응답으로 상태가 확정되므로 상세 상태는 직접 갱신, 목록은 재조회
      queryClient.setQueryData(["favorites", "status", movieId], !wasFavorite);
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: async (error) => {
      alert(await getErrorMessage(error, "즐겨찾기 처리에 실패했어요."));
    },
  });
}
