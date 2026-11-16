import { authApi } from "../auth-api";
import type {
  UpdateRatingRequest,
  Rating,
  RatingApiResponse,
} from "./models";

export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingApiResponse<Rating>>();

  return response.result;
}