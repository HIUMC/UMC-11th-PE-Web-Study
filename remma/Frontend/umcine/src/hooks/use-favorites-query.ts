import { useQuery } from "@tanstack/react-query";
import { favoriteKeys } from "../api/favorites/favorite-keys";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

/** 로그인한 사용자의 즐겨찾기 목록을 조회해요. */
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

/** 로그인한 사용자가 특정 영화를 즐겨찾기했는지 단건으로 조회해요. */
export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && enabled,
    retry: false,
  });
}
