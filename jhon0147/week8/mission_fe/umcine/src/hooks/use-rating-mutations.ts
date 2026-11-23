import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRatingOptions, deleteRatingOptions, updateRatingOptions } from "../mutations/account-mutations";
import { accountKeys } from "../queries/account-queries";
import { useAuthStore } from "../stores/auth-store";
import type { Rating } from "../types/account";

export function useRatingMutations(memberId: number | null) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore(state => state.accessToken);
  const queryKey = accountKeys.ratings(memberId);
  const isCurrentSession = () => accessToken === useAuthStore.getState().accessToken;

  const create = useMutation({
    ...createRatingOptions,
    onSuccess: async () => {
      if (isCurrentSession()) await queryClient.invalidateQueries({ queryKey });
    },
  });
  const update = useMutation({
    ...updateRatingOptions,
    onSuccess: async (rating) => {
      await queryClient.cancelQueries({ queryKey });
      if (!isCurrentSession()) return;
      queryClient.setQueryData<Rating[]>(queryKey, old => old?.map(item => item.ratingId === rating.ratingId ? rating : item));
    },
  });
  const remove = useMutation({
    ...deleteRatingOptions,
    onSuccess: async (_, ratingId) => {
      await queryClient.cancelQueries({ queryKey });
      if (!isCurrentSession()) return;
      queryClient.setQueryData<Rating[]>(queryKey, old => old?.filter(item => item.ratingId !== ratingId));
    },
  });
  return { create, update, remove };
}
