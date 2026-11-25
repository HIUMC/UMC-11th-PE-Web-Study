"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";

export function useDeleteRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: deleteRating,
    // 삭제 응답의 result는 null이므로 요청에 쓴 ratingId로 목록에서 뺌
    onSuccess: (_response, ratingId) => {
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) =>
        prev.filter((rating) => rating.ratingId !== ratingId),
      );
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
