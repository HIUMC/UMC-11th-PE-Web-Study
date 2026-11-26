import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteMutationOptions } from "../mutations/account-mutations";
import { accountKeys } from "../queries/account-queries";
import { useAuthStore } from "../stores/auth-store";
import { getMemberId } from "../utils/member-id";

export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore(state => state.accessToken);
  const memberId = getMemberId(accessToken);
  return useMutation({
    ...favoriteMutationOptions,
    onSuccess: async (_, { movieId, isFavorite }) => {
      const queryKey = accountKeys.favoriteStatus(memberId, movieId);
      await queryClient.cancelQueries({ queryKey });
      if (accessToken !== useAuthStore.getState().accessToken) return;
      queryClient.setQueryData(queryKey, { isFavorite: !isFavorite });
      await queryClient.invalidateQueries({ queryKey: accountKeys.favorites(memberId) });
    },
  });
}
