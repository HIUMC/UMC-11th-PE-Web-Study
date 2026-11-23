import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRating } from "@/api/ratings/delete-rating";
import type { Rating } from "@/api/ratings/models";

export function useDeleteRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,

    onSuccess: (_, ratingId) => {
      if (memberId !== undefined) {
        queryClient.setQueryData<Rating[]>(
          ["members", memberId, "ratings"],
          (oldRatings) =>
            (oldRatings ?? []).filter(
              (item) => item.ratingId !== ratingId,
            ),
        );
      }

      alert("평점이 삭제됐어요.");
    },

    onError: () => {
      alert("평점 삭제에 실패했어요.");
    },
  });
}