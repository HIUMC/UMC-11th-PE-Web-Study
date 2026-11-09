import type { AvailabilityResponse, RatingPage } from "../types/member";
import { umcClient } from "./umc-client";

export async function checkNickname(nickname: string) {
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export async function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

// page는 서버 기준(0부터 시작)으로 보냅니다.
export async function getMemberRatings(
  memberId: number,
  page: number,
  size: number,
  signal?: AbortSignal,
) {
  return umcClient
    .get(`members/${memberId}/ratings`, {
      searchParams: { page, size },
      signal,
    })
    .json<RatingPage>();
}
