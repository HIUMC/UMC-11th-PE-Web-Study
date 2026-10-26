import { backendClient } from "../backend-client";
import type { AvailabilityResponse, MemberRating } from "./models";

export function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

export function getMemberRatings(memberId: string) {
  return backendClient
    .get(`members/${encodeURIComponent(memberId)}/ratings`)
    .json<MemberRating[]>();
}
