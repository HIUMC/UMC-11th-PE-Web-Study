import { apiClient, authenticatedResult, authHeaders, type ApiResponse } from "./api-client";

export interface Rating { ratingId: number; movieId: number; score: number; comment: string | null; createdAt: string; updatedAt: string }
export function getMemberRatings(memberId: number) { return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>(); }
export function createRating(movieId: number, score: number, comment: string | null) { return authenticatedResult(apiClient.post("ratings", { headers: authHeaders(), json: { movieId, score, comment } }).json<ApiResponse<Rating>>()); }
export function updateRating(ratingId: number, score: number, comment: string | null) { return authenticatedResult(apiClient.patch(`ratings/${ratingId}`, { headers: authHeaders(), json: { score, comment } }).json<ApiResponse<Rating>>()); }
export function deleteRating(ratingId: number) { return authenticatedResult(apiClient.delete(`ratings/${ratingId}`, { headers: authHeaders() }).json<ApiResponse<null>>()); }
