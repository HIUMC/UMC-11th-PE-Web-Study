import { umcClient } from "../umc-client";

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getMemberRatings(memberId: number) {
  return umcClient.get(`members/${memberId}/ratings`).json<MemberRating[]>();
}

export type { MemberRating };