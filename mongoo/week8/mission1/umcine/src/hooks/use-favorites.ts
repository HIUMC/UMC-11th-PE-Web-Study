import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { useAuthStore } from "../stores/auth-store";

export function useFavorites() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const listKey = ["favorites", "list", accessToken];
  const mutationKey = ["favorites", "toggle", accessToken];

  const favoritesQuery = useQuery({
    queryKey: listKey,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });

  // 다른 카드에서 변경 중일 때도 중복 요청을 막아요.
  const pendingCount = useIsMutating({ mutationKey });

  const mutation = useMutation({
    mutationKey,
    mutationFn: async ({ movieId, wasFavorite }: {
      movieId: number;
      wasFavorite: boolean;
    }) => {
      if (wasFavorite) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },
    onSuccess: async (_response, { movieId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listKey }),
        queryClient.invalidateQueries({
          queryKey: ["favorites", "status", movieId, accessToken],
        }),
      ]);
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });

  const bookmarkedMovieIds = accessToken
    ? favoritesQuery.data?.map((favorite) => favorite.movieId) ?? []
    : [];

  const isBookmarkDisabled = Boolean(accessToken) && (
    favoritesQuery.isPending ||
    favoritesQuery.isFetching ||
    pendingCount > 0
  );

  function toggleBookmark(movieId: number) {
    if (!accessToken) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    if (isBookmarkDisabled) return;

    if (!favoritesQuery.isSuccess) {
      void favoritesQuery.refetch();
      alert("즐겨찾기 목록을 다시 불러올게요. 잠시 후 다시 눌러 주세요.");
      return;
    }

    mutation.mutate({
      movieId,
      wasFavorite: bookmarkedMovieIds.includes(movieId),
    });
  }

  return {
    bookmarkedMovieIds,
    toggleBookmark,
    isBookmarkDisabled,
    bookmarkError: Boolean(accessToken) && favoritesQuery.isError,
  };
}
