import ky from "ky";

const membersUrl = "http://localhost:8080/members";

//이메일 중복확인
export function checkEmail(email: string) {
  return ky
    .get(`${membersUrl}/email/${encodeURIComponent(email)}`)
    .json<{ available: boolean }>();
}

//닉네임 중복확인
export function checkNickname(nickname: string) {
  return ky
    .get(`${membersUrl}/nickname/${encodeURIComponent(nickname)}`)
    .json<{ available: boolean }>();
}

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
