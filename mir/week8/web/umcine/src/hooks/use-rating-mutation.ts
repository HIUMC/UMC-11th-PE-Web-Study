import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  updateRating,
  type UpdateRatingRequest,
} from "../api/ratings/ratings";

export function useCreateRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", memberId, "ratings"],
      });
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ratingId,
      body,
    }: {
      ratingId: number;
      body: UpdateRatingRequest;
    }) => updateRating(ratingId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", memberId, "ratings"],
      });
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", memberId, "ratings"],
      });
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
