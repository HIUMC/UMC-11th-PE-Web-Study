import { authApi } from "../auth-api";
import type {
  CreateRatingRequest,
  Rating,
  RatingApiResponse,
} from "./models";

export async function createRating(
  body: CreateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<RatingApiResponse<Rating>>();

  return response.result;
}