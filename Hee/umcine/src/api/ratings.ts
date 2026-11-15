import { authApi } from "./auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveRatingRequest {
  movieId: number;
  score: number;
  comment?: string | null;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string | null;
}

type RatingsResponse = Rating[] | { result: Rating[] };

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<RatingsResponse>();
  return Array.isArray(response) ? response : response.result;
}

export function createRating(body: SaveRatingRequest) {
  return authApi.post("ratings", { json: body }).json();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json();
}
