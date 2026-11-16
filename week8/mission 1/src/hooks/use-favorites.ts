import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "@/api/favorites";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberId } from "@/utils/auth";

export function useFavorites() {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  return useQuery({
    queryKey: ["favorites", memberId, "list"],
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(token), retry: false,
  });
}

export function useFavorite(movieId: number) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  return useQuery({
    queryKey: ["favorites", memberId, "movie", movieId],
    queryFn: ({ signal }) => getFavorite(movieId, signal),
    enabled: Boolean(token) && Number.isSafeInteger(movieId) && movieId > 0,
    retry: false,
  });
}

export function useToggleFavorite() {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  const client = useQueryClient();
  const navigate = useNavigate();
  const mutationKey = ["favorites", memberId];
  const pendingCount = useIsMutating({ mutationKey });
  const mutation = useMutation({
    mutationKey,
    mutationFn: async ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) => {
      if (!token || useAuthStore.getState().accessToken !== token) throw new Error("로그인 상태가 변경됐어요.");
      if (isFavorite) await deleteFavorite(movieId);
      else await addFavorite(movieId);
    },
    retry: false,
    onMutate: () => client.cancelQueries({ queryKey: ["favorites", memberId] }),
    onSuccess: async (_, { movieId, isFavorite }) => {
      if (useAuthStore.getState().accessToken !== token) return;
      client.setQueryData(["favorites", memberId, "movie", movieId], !isFavorite);
      client.setQueryData<number[]>(["favorites", memberId, "list"], (previous) => {
        if (!previous) return previous;
        return isFavorite ? previous.filter((id) => id !== movieId) : [...new Set([movieId, ...previous])];
      });
      await client.invalidateQueries({ queryKey: ["favorites", memberId] });
    },
  });

  function toggle(movieId: number, isFavorite: boolean) {
    if (!token) { void navigate({ to: "/login" }); return; }
    if (client.isMutating({ mutationKey })) return;
    mutation.mutate({ movieId, isFavorite });
  }

  return { ...mutation, toggle, isPending: pendingCount > 0 };
}

// 목록·검색·마이페이지는 같은 서버 목록을 공유합니다.
export function useBookmarks() {
  const token = useAuthStore((state) => state.accessToken);
  const query = useFavorites();
  const mutation = useToggleFavorite();
  const bookmarkedMovieIds = token ? query.data ?? [] : [];
  const disabled = mutation.isPending || (Boolean(token) && !query.isSuccess);
  function toggleBookmark(movieId: number) {
    if (disabled) return;
    mutation.toggle(movieId, bookmarkedMovieIds.includes(movieId));
  }
  return { query, mutation, bookmarkedMovieIds, toggleBookmark, disabled, isLoading: Boolean(token) && query.isPending };
}
