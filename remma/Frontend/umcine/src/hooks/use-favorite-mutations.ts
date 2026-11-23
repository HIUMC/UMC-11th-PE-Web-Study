import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getApiErrorMessage } from "../api/api-response";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { favoriteKeys } from "../api/favorites/favorite-keys";
import type { FavoriteItem, FavoriteStatus } from "../api/favorites/models";

export const createFavoriteMutationOptions = mutationOptions({
  mutationKey: ["favorites", "create"] as const,
  mutationFn: createFavorite,
});

export const deleteFavoriteMutationOptions = mutationOptions({
  mutationKey: ["favorites", "delete"] as const,
  mutationFn: deleteFavorite,
});

interface FavoriteMutationCallbacks {
  onErrorMessage?: (message: string) => void;
}

export function useAddFavoriteMutation(callbacks?: FavoriteMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    ...createFavoriteMutationOptions,
    onSuccess: (response, { movieId }) => {
      queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
        isFavorite: true,
      });

      const created = response.result;
      if (created) {
        // 이미 목록 캐시가 있을 때만 맨 앞에 추가하고, 없으면 다음 조회 시 전체 목록을 받아와요.
        queryClient.setQueryData<FavoriteItem[]>(
          favoriteKeys.list(),
          (previous) =>
            previous
              ? [created, ...previous.filter((item) => item.movieId !== movieId)]
              : undefined,
        );
      } else {
        queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      }
    },
    onError: async (error, { movieId }) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.status(movieId) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });

      const message = await getApiErrorMessage(
        error,
        "즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.",
      );
      if (callbacks?.onErrorMessage) {
        callbacks.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}

export function useRemoveFavoriteMutation(callbacks?: FavoriteMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteFavoriteMutationOptions.mutationKey,
    mutationFn: deleteFavorite,
    // 낙관적 업데이트: 응답을 기다리지 않고 화면을 먼저 바꾼 뒤, 실패 시 롤백해요.
    onMutate: async (movieId) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.status(movieId) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list() });

      const previousStatus = queryClient.getQueryData<FavoriteStatus>(
        favoriteKeys.status(movieId),
      );
      const previousList = queryClient.getQueryData<FavoriteItem[]>(
        favoriteKeys.list(),
      );

      if (previousStatus !== undefined) {
        queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
          isFavorite: false,
        });
      }

      if (previousList !== undefined) {
        queryClient.setQueryData<FavoriteItem[]>(
          favoriteKeys.list(),
          previousList.filter((item) => item.movieId !== movieId),
        );
      }

      return { previousStatus, previousList };
    },
    onError: async (error, movieId, context) => {
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          favoriteKeys.status(movieId),
          context.previousStatus,
        );
      }
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(favoriteKeys.list(), context.previousList);
      }

      const message = await getApiErrorMessage(
        error,
        "즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.",
      );
      if (callbacks?.onErrorMessage) {
        callbacks.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
    onSettled: (_data, _error, movieId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.status(movieId) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}
