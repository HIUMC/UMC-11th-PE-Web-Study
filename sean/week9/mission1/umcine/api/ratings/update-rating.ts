import { authApi } from "../auth-api";
import type { Rating } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}
