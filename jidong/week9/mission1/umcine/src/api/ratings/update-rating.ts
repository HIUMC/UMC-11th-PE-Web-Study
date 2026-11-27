import type { MemberRatingResponse } from "../members/models";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

export async function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<MemberRatingResponse>>();
  return response.result;
}
