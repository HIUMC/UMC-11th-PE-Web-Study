import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

// 평점 등록 (이미 평점을 남긴 영화면 409 RATING409_1)
export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<RatingApiResponse<Rating>>();
}
