import { authApi } from "./auth-api";

export interface Rating { ratingId: number; movieId: number; score: number; review?: string; }
interface ApiResponse<T> { isSuccess: boolean; code: string; message: string; result: T; }

export async function getMemberRatings(memberId: number): Promise<Rating[]> { return (await authApi.get(`members/${memberId}/ratings`).json<ApiResponse<Rating[]>>()).result; }
export function createRating(body: { movieId: number; score: number; review?: string }) { return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>(); }
export function updateRating(ratingId: number, body: { score: number; review?: string }) { return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>(); }
export function deleteRating(ratingId: number) { return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<unknown>>(); }
