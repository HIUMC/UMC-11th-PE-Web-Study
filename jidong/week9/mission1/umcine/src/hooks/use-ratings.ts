import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { getMemberRatings } from "../api/members/get-member-ratings";
import type { MemberRatingResponse } from "../api/members/models";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id-from-token";
import { queryKeys } from "./query-keys";

export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

export function useMemberRatingsQuery(memberId: number | null) {
  return useQuery({
    queryKey: queryKeys.memberRatings(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId ?? 0),
    enabled: memberId !== null,
  });
}

export function useRatingMutations(memberId: number) {
  const queryClient = useQueryClient();
  const key = queryKeys.memberRatings(memberId);

  const setRatings = (
    updater: (previous: MemberRatingResponse[]) => MemberRatingResponse[],
  ) =>
    queryClient.setQueryData<MemberRatingResponse[]>(key, (previous) =>
      previous ? updater(previous) : previous,
    );

  const handleError = (error: unknown) => {
    if (isHTTPError(error) && [404, 409].includes(error.response.status)) {
      queryClient.invalidateQueries({ queryKey: key });
      alert("평점이 바뀌어 있어서 최신 상태로 다시 불러올게요.");
      return;
    }
    alert("평점을 저장하지 못했어요. 다시 시도해 주세요.");
  };

  const create = useMutation({
    mutationFn: createRating,
    onSuccess: (rating) => {
      setRatings((previous) => [rating, ...previous]);
      alert("평점을 등록했어요.");
    },
    onError: handleError,
  });

  const update = useMutation({
    mutationFn: updateRating,
    onSuccess: (rating) => {
      setRatings((previous) =>
        previous.map((item) => (item.ratingId === rating.ratingId ? rating : item)),
      );
      alert("평점을 수정했어요.");
    },
    onError: handleError,
  });

  const remove = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      setRatings((previous) => previous.filter((item) => item.ratingId !== ratingId));
      alert("평점을 삭제했어요.");
    },
    onError: handleError,
  });

  return { create, update, remove };
}
