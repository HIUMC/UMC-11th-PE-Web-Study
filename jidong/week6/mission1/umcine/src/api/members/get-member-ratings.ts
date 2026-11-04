import { umcineClient } from "../umcine-client";
import type { MemberRatingResponse } from "./models";

type GetMemberRatingsResponse = MemberRatingResponse[];

function getMemberRatings(memberId: number) {
  return umcineClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse };
