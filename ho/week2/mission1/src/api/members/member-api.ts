import ky, { isHTTPError } from "ky";

const memberClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_MEMBER_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "")}/`,
  retry: 0,
  timeout: 10000,
});

export interface AvailabilityResponse {
  available: boolean;
}

export interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function checkAvailability(field: "nickname" | "email", value: string) {
  return memberClient.get(`members/${field}/${encodeURIComponent(value)}`).json<AvailabilityResponse>();
}

export function getMemberRatings(memberId: number) {
  return memberClient.get(`members/${memberId}/ratings`).json<MemberRating[]>();
}

export function getMemberErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    if (error.response.status === 404) return "정보를 찾을 수 없어요. 회원 번호를 확인해 주세요.";
    if (error.response.status === 400) return "입력한 값을 확인해 주세요.";
    return "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }
  return "서버에 연결하지 못했어요. 백엔드 실행 상태와 CORS 설정을 확인해 주세요.";
}
