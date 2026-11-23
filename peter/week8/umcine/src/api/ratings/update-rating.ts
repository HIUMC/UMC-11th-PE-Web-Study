import { authApi } from "../auth-api";
import type { Rating } from "./get-member-ratings";

export interface UpdateRatingRequest {
  score: number;
  // 현재 API는 후기를 생략해도 기존 후기를 삭제한다.
  comment?: string | null;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();

  return response.result;
}
