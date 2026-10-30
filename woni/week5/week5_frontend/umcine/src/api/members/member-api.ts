import ky from "ky";
import type { AvailabilityResponse, RatingResponse } from "./models";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export function checkNickname(nickname: string) {
  return ky
    .get(`${BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export function checkEmail(email: string) {
  return ky
    .get(`${BASE_URL}/members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

export function getMemberRatings(memberId: number) {
  return ky
    .get(`${BASE_URL}/members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}
