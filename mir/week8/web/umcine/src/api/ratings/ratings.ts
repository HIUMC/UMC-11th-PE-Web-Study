import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";

export interface RatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getMemberRatings(
  memberId: number,
): Promise<RatingItem[]> {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<RatingItem[] | ApiResponse<RatingItem[]>>();

  return Array.isArray(response) ? response : response.result;
}

export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<ApiResponse<RatingItem>>();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<RatingItem>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}

export function memberRatingsQueryOptions(memberId: number | null) {
  const isValidMemberId =
    memberId !== null && Number.isInteger(memberId) && memberId > 0;

  return queryOptions({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: isValidMemberId,
    staleTime: 60 * 1000,
    retry: false,
  });
}
