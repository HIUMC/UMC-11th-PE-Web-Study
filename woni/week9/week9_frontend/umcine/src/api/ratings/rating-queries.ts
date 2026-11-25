import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "./get-member-ratings";

// ["ratings", memberId]는 회원의 평점 목록
export const ratingQueries = {
  byMember: (memberId: number) =>
    queryOptions({
      queryKey: ["ratings", memberId],
      queryFn: () => getMemberRatings(memberId),
    }),
};
