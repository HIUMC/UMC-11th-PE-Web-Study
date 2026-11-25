import { apiClient } from "../api-client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getMemberRatings(memberId: number): Promise<Rating[]> {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<Rating[]>();
}
