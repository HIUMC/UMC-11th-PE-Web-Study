import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getApiErrorMessage } from "../api/api-response";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import type { RatingItem } from "../api/ratings/models";
import { ratingKeys } from "../api/ratings/rating-keys";
import { updateRating } from "../api/ratings/update-rating";

export const createRatingMutationOptions = mutationOptions({
  mutationKey: ["ratings", "create"] as const,
  mutationFn: createRating,
});

export const updateRatingMutationOptions = mutationOptions({
  mutationKey: ["ratings", "update"] as const,
  mutationFn: updateRating,
});

export const deleteRatingMutationOptions = mutationOptions({
  mutationKey: ["ratings", "delete"] as const,
  mutationFn: deleteRating,
});

interface RatingMutationCallbacks {
  onSuccessMessage?: (message: string) => void;
  onErrorMessage?: (message: string) => void;
}

export function useCreateRatingMutation(
  memberId: number | undefined,
  callbacks?: RatingMutationCallbacks,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...createRatingMutationOptions,
    onSuccess: (response) => {
      if (memberId !== undefined) {
        const created = response.result;
        if (created) {
          const existing = queryClient.getQueryData<RatingItem[]>(
            ratingKeys.byMember(memberId),
          );
          if (existing) {
            queryClient.setQueryData<RatingItem[]>(
              ratingKeys.byMember(memberId),
              [
                created,
                ...existing.filter((item) => item.ratingId !== created.ratingId),
              ],
            );
          } else {
            queryClient.invalidateQueries({
              queryKey: ratingKeys.byMember(memberId),
            });
          }
        } else {
          queryClient.invalidateQueries({
            queryKey: ratingKeys.byMember(memberId),
          });
        }
      }

      callbacks?.onSuccessMessage?.(
        response.message || "평점을 등록했어요.",
      );
    },
    onError: async (error) => {
      if (memberId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: ratingKeys.byMember(memberId),
        });
      }

      const message = await getApiErrorMessage(
        error,
        "평점 등록에 실패했어요. 다시 시도해 주세요.",
      );
      if (callbacks?.onErrorMessage) {
        callbacks.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}

export function useUpdateRatingMutation(
  memberId: number | undefined,
  callbacks?: RatingMutationCallbacks,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateRatingMutationOptions,
    onSuccess: (response) => {
      if (memberId !== undefined) {
        const updated = response.result;
        if (updated) {
          const existing = queryClient.getQueryData<RatingItem[]>(
            ratingKeys.byMember(memberId),
          );
          if (existing) {
            queryClient.setQueryData<RatingItem[]>(
              ratingKeys.byMember(memberId),
              existing.map((item) =>
                item.ratingId === updated.ratingId ? updated : item,
              ),
            );
          } else {
            queryClient.invalidateQueries({
              queryKey: ratingKeys.byMember(memberId),
            });
          }
        } else {
          queryClient.invalidateQueries({
            queryKey: ratingKeys.byMember(memberId),
          });
        }
      }

      callbacks?.onSuccessMessage?.(
        response.message || "평점을 수정했어요.",
      );
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(
        error,
        "평점 수정에 실패했어요. 다시 시도해 주세요.",
      );
      if (callbacks?.onErrorMessage) {
        callbacks.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}

export function useDeleteRatingMutation(
  memberId: number | undefined,
  callbacks?: RatingMutationCallbacks,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteRatingMutationOptions,
    onSuccess: (response, ratingId) => {
      if (memberId !== undefined) {
        const existing = queryClient.getQueryData<RatingItem[]>(
          ratingKeys.byMember(memberId),
        );
        if (existing) {
          queryClient.setQueryData<RatingItem[]>(
            ratingKeys.byMember(memberId),
            existing.filter((item) => item.ratingId !== ratingId),
          );
        } else {
          queryClient.invalidateQueries({
            queryKey: ratingKeys.byMember(memberId),
          });
        }
      }

      callbacks?.onSuccessMessage?.(
        response.message || "평점을 삭제했어요.",
      );
    },
    onError: async (error) => {
      if (memberId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: ratingKeys.byMember(memberId),
        });
      }

      const message = await getApiErrorMessage(
        error,
        "평점 삭제에 실패했어요. 다시 시도해 주세요.",
      );
      if (callbacks?.onErrorMessage) {
        callbacks.onErrorMessage(message);
      } else {
        alert(message);
      }
    },
  });
}
