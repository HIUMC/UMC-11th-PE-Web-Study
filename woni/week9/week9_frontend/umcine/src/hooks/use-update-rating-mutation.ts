"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";
import { updateRating } from "../api/ratings/update-rating";

export function useUpdateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      const updated = response.result;
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) =>
        prev.map((rating) =>
          rating.ratingId === updated.ratingId ? updated : rating,
        ),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
