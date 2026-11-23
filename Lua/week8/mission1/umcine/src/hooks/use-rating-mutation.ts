import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, updateRating } from "../api/ratings";

export function useRatingMutation(memberId: number | undefined, movieId: number) {
  const queryClient = useQueryClient();
  const invalidate = () => memberId && queryClient.invalidateQueries({ queryKey: ["ratings", memberId] });
  return {
    create: useMutation({ mutationFn: createRating, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ ratingId, score }: { ratingId: number; score: number }) => updateRating(ratingId, { score }), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteRating, onSuccess: invalidate }),
    movieId,
  };
}
