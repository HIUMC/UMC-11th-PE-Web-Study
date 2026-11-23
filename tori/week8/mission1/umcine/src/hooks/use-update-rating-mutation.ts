import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRating } from "@/api/ratings/update-rating";
import type { Rating } from "@/api/ratings/models";

interface UpdateRatingVariables {
  ratingId: number;
  body: {
    score: number;
    comment: string;
  };
}

export function useUpdateRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratingId, body }: UpdateRatingVariables) =>
      updateRating(ratingId, body),

    onSuccess: (updatedRating) => {
      if (memberId !== undefined) {
        queryClient.setQueryData<Rating[]>(
          ["members", memberId, "ratings"],
          (oldRatings) =>
            (oldRatings ?? []).map((item) =>
              item.ratingId === updatedRating.ratingId
                ? updatedRating
                : item,
            ),
        );
      }

      alert("평점이 수정됐어요.");
    },

    onError: () => {
      alert("평점 수정에 실패했어요.");
    },
  });
}