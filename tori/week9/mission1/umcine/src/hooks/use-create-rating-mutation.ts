import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRating } from "@/api/ratings/create-rating";
import type { Rating } from "@/api/ratings/models";

export function useCreateRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,

    onSuccess: (createdRating) => {
      if (memberId !== undefined) {
        queryClient.setQueryData<Rating[]>(
          ["members", memberId, "ratings"],
          (oldRatings) => {
            const previousRatings = oldRatings ?? [];

            return [
              ...previousRatings.filter(
                (item) => item.movieId !== createdRating.movieId,
              ),
              createdRating,
            ];
          },
        );
      }

      alert("평점이 등록됐어요.");
    },

    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}