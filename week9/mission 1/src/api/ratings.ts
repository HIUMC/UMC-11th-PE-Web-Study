import { authApi } from "./auth-api";
import { checkMutationResponse, unwrapResponse, type ApiResponse } from "./response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export async function getMemberRatings(memberId: number, signal?: AbortSignal): Promise<Rating[]> {
  // 현재 백엔드의 조회 컨트롤러는 envelope 없이 배열을 반환합니다.
  return authApi.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(body: RatingInput & { movieId: number }) {
  return unwrapResponse(await authApi.post("ratings", { json: body, retry: 0 }).json<ApiResponse<Rating>>());
}

export async function updateRating(ratingId: number, body: RatingInput) {
  return unwrapResponse(await authApi.patch(`ratings/${ratingId}`, { json: body, retry: 0 }).json<ApiResponse<Rating>>());
}

export async function deleteRating(ratingId: number) {
  await checkMutationResponse(await authApi.delete(`ratings/${ratingId}`, { retry: 0 }));
}
