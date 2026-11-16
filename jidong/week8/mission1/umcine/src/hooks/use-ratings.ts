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

// 토큰 payload의 sub에서 내 회원 번호를 꺼냄
export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

// 유저별 평점 조회는 공개 API라 토큰 없이도 되지만, 화면에서는 내 평점을 찾을 때만 씀
export function useMemberRatingsQuery(memberId: number | null) {
  return useQuery({
    queryKey: queryKeys.memberRatings(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId ?? 0),
    enabled: memberId !== null,
  });
}

// 평점 등록/수정/삭제 응답으로 내 평점 목록 캐시를 바로 고침
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
    // 이미 남긴 평점(409)이나 이미 지운 평점(404)이면 캐시가 어긋난 거라 다시 조회함
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
      // 서버는 최신순으로 주니까 새 평점을 맨 앞에 넣음
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
