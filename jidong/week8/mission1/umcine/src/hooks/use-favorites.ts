import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { addFavorite } from "../api/favorites/add-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

// 마이페이지 목록, 영화 카드의 버튼 상태에 씀
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

// 카드마다 요청하지 않고 목록 한 번으로 즐겨찾기한 영화 ID를 계산함 (같은 key라 요청은 한 번만 감)
export function useFavoriteMovieIds() {
  const favoritesQuery = useFavoritesQuery();
  return new Set(favoritesQuery.data?.map((favorite) => favorite.movieId));
}

// 영화 상세에서 버튼을 채운 상태로 보여 줄지 정할 때 씀
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favoriteStatus(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
  });
}

interface ToggleFavoriteVariables {
  movieId: number;
  isFavorite: boolean;
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables) =>
      isFavorite ? removeFavorite(movieId).then(() => null) : addFavorite(movieId),
    onSuccess: (favorite, { movieId, isFavorite }) => {
      // 결과를 이미 알고 있어서 다시 조회 안 하고 두 캐시를 바로 고침
      queryClient.setQueryData<FavoriteStatus>(queryKeys.favoriteStatus(movieId), {
        isFavorite: !isFavorite,
      });
      // 목록 캐시가 있을 때만 고침 (아직 안 불러왔으면 나중에 조회할 때 최신으로 받음)
      queryClient.setQueryData<Favorite[]>(queryKeys.favorites, (previous) => {
        if (!previous) return previous;
        if (isFavorite) return previous.filter((item) => item.movieId !== movieId);
        return favorite ? [favorite, ...previous] : previous;
      });
    },
    onError: (error) => {
      // 다른 탭에서 이미 바꿨으면 409/404가 옴. 화면이 서버랑 어긋난 거라 다시 조회함
      if (isHTTPError(error) && [404, 409].includes(error.response.status)) {
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
        alert("즐겨찾기 상태가 바뀌어 있어서 최신 상태로 다시 불러올게요.");
        return;
      }
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
