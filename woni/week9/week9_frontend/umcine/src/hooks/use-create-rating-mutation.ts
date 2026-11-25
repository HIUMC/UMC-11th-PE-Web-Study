"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import type { Rating } from "../api/ratings/models";
import { ratingQueries } from "../api/ratings/rating-queries";

export function useCreateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();
  const queryKey = ratingQueries.byMember(memberId).queryKey;

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      // 응답에 등록된 평점이 오므로 목록 맨 앞(최신 순)에 바로 넣음
      queryClient.setQueryData<Rating[]>(queryKey, (prev = []) => [
        response.result,
        ...prev,
      ]);
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
      // 이미 등록된 경우(409) 등 화면 상태가 서버와 다를 수 있으므로 다시 맞춤
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
