import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { RatingItem, UpdateRatingVariables } from "./models";

export type UpdateRatingResponse = ApiResponse<RatingItem>;

export function updateRating({ ratingId, body }: UpdateRatingVariables) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}
