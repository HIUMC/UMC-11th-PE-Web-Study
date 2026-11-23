import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import { ratingKeys } from "../api/ratings/rating-keys";

/** 특정 회원이 작성한 평점 목록을 조회해요. */
export function useMemberRatingsQuery(memberId: number | undefined) {
  return useQuery({
    queryKey:
      memberId !== undefined ? ratingKeys.byMember(memberId) : ratingKeys.all,
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
    retry: false,
  });
}
