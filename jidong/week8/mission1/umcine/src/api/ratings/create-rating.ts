import type { MemberRatingResponse } from "../members/models";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export async function createRating(body: CreateRatingRequest) {
  const response = await authApi
    .post("ratings", { json: body })
    .json<ApiResponse<MemberRatingResponse>>();
  return response.result;
}
