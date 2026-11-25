import { authApi } from "../auth-api";
import type { RatingApiResponse } from "./models";

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<RatingApiResponse<null>>();
}
