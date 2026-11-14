import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, updateRating, deleteRating, getMemberRatings, type RatingInput, type Rating } from "@/api/ratings";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberId } from "@/utils/auth";

export function useRatings() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const query = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: ({ signal }) => {
      if (!memberId) throw new Error("회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.");
      return getMemberRatings(memberId, signal);
    },
    enabled: Boolean(accessToken) && memberId !== null,
    retry: false,
  });
  return { ...query, memberId, accessToken };
}

type RatingAction =
  | { type: "create"; movieId: number; input: RatingInput }
  | { type: "update"; ratingId: number; input: RatingInput }
  | { type: "delete"; ratingId: number };

export function useRatingMutation() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (action: RatingAction) => {
      if (!accessToken || !memberId) throw new Error("로그인 후 이용해 주세요.");
      if (action.type === "create") return createRating({ movieId: action.movieId, ...action.input });
      if (action.type === "update") return updateRating(action.ratingId, action.input);
      await deleteRating(action.ratingId);
      return null;
    },
    retry: false,
    onSuccess: async (saved, action) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      client.setQueryData<Rating[]>(["ratings", memberId], (previous) => {
        const ratings = previous ?? [];
        if (action.type === "delete") return ratings.filter((rating) => rating.ratingId !== action.ratingId);
        if (!saved) return ratings;
        return [saved, ...ratings.filter((rating) => rating.ratingId !== saved.ratingId)];
      });
      await client.invalidateQueries({ queryKey: ["ratings", memberId] });
    },
  });
}
