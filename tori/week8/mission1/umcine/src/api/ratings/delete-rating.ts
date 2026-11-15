import { authApi } from "../auth-api";
import type { RatingApiResponse } from "./models";

export async function deleteRating(
  ratingId: number,
): Promise<void> {
  await authApi
    .delete(`ratings/${ratingId}`)
    .json<RatingApiResponse<null>>();
}