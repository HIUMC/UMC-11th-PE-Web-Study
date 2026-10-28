import { serverClient } from "../server-client";
import type { AvailabilityResponse, MemberRating } from "./models";

export function checkNickname(nickname: string) {
  return serverClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export function checkEmail(email: string) {
  return serverClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

export function getMemberRatings(memberId: number) {
  return serverClient.get(`members/${memberId}/ratings`).json<MemberRating[]>();
}
