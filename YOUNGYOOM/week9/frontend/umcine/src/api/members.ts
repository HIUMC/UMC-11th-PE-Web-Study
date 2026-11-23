import ky from "ky";

const membersUrl = "http://localhost:8080/members";

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

//평점 확인
export function getMemberRatings(memberId: number) {
  return ky.get(`${membersUrl}/${memberId}/ratings`).json<RatingResponse[]>();
}
