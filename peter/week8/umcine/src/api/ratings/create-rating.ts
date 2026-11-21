import { authApi } from "../auth-api";
import type { Rating } from "./get-member-ratings";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string | null;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export async function createRating(
  body: CreateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<CreateRatingResponse>();

  return response.result;
}
