import { authApi } from "../auth-api";
import type { MemberRating } from "../members/models";

interface RatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRating;
}

interface DeleteRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

// 회원이 작성한 전체 평점 조회
export function getMemberRatings(memberId: number) {
  return authApi
    .get(`members/${memberId}/ratings`)
    .json<MemberRating[]>();
}

// 현재 영화에 평점 등록
export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<RatingResponse>();
}

// 이미 작성한 평점 수정
export function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse>();
}

// 이미 작성한 평점 삭제
export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<DeleteRatingResponse>();
}