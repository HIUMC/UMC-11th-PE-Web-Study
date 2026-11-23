import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";

export type DeleteRatingResponse = ApiResponse<null>;

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<DeleteRatingResponse>();
}
