import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import type { ApiResponse } from "./members/login";
export interface Rating { ratingId: number; movieId: number; score: number; comment: string | null; createdAt: string; updatedAt: string }
export interface RatingInput { score: number; comment: string }
export function getRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}
export function createRating(movieId: number, body: RatingInput) {
  return authApi.post("ratings", { json: { movieId, ...body } }).json<ApiResponse<Rating>>();
}
export function updateRating(ratingId: number, body: RatingInput) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}
export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
