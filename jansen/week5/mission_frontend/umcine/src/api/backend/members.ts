import ky from "ky";

const BACKEND_BASE_URL = "http://localhost:8080";

interface CheckResponse {
  available: boolean;
}

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

function checkNickname(nickname: string) {
  return ky
    .get(`${BACKEND_BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

function checkEmail(email: string) {
  return ky
    .get(`${BACKEND_BASE_URL}/members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}

function getMemberRatings(memberId: number) {
  return ky
    .get(`${BACKEND_BASE_URL}/members/${memberId}/ratings`)
    .json<MemberRating[]>();
}

export {
  checkNickname,
  checkEmail,
  getMemberRatings,
  type CheckResponse,
  type MemberRating,
};