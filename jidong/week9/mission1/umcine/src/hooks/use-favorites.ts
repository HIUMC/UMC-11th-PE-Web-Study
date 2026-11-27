import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { addFavorite } from "../api/favorites/add-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { useAuthStore } from "../stores/auth-store";
import { queryKeys } from "./query-keys";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteMovieIds() {
  const favoritesQuery = useFavoritesQuery();
  return new Set(favoritesQuery.data?.map((favorite) => favorite.movieId));
}

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
      queryClient.setQueryData<FavoriteStatus>(queryKeys.favoriteStatus(movieId), {
        isFavorite: !isFavorite,
      });
      queryClient.setQueryData<Favorite[]>(queryKeys.favorites, (previous) => {
        if (!previous) return previous;
        if (isFavorite) return previous.filter((item) => item.movieId !== movieId);
        return favorite ? [favorite, ...previous] : previous;
      });
    },
    onError: (error) => {
      if (isHTTPError(error) && [404, 409].includes(error.response.status)) {
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
        alert("즐겨찾기 상태가 바뀌어 있어서 최신 상태로 다시 불러올게요.");
        return;
      }
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
