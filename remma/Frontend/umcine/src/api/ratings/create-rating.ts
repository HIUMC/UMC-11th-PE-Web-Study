import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { CreateRatingRequest, RatingItem } from "./models";

export type CreateRatingResponse = ApiResponse<RatingItem>;

export function createRating(request: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: request })
    .json<CreateRatingResponse>();
}
