import type { Rating, RatingInput } from "../types/member";
import { getMemberRatings } from "./members-api";
import { getResult, umcClient } from "./umc-client";

const RATING_PAGE_SIZE = 100;

export async function getAllMemberRatings(
  memberId: number,
  signal?: AbortSignal,
) {
  const ratings: Rating[] = [];
  for (let page = 0; ; page += 1) {
    const result = await getMemberRatings(
      memberId,
      page,
      RATING_PAGE_SIZE,
      signal,
    );
    ratings.push(...result.ratings);
    if (!result.hasNext) {
      return ratings;
    }
  }
}

function toRatingBody({ score, comment }: RatingInput) {
  const trimmed = comment.trim();
  return { score, comment: trimmed ? trimmed : null };
}

export function createRating(movieId: number, input: RatingInput) {
  return getResult<Rating>(
    umcClient.post("ratings", { json: { movieId, ...toRatingBody(input) } }),
  );
}

export function updateRating(ratingId: number, input: RatingInput) {
  return getResult<Rating>(
    umcClient.patch(`ratings/${ratingId}`, { json: toRatingBody(input) }),
  );
}

export function deleteRating(ratingId: number) {
  return getResult<null>(umcClient.delete(`ratings/${ratingId}`));
}
