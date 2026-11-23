import type {
  AvailabilityResponse,
  LoginRequest,
  LoginResult,
  MemberInfo,
  RatingPage,
  SignUpRequest,
  SignUpResult,
} from "../types/member";
import { getResult, umcClient } from "./umc-client";

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

export function logIn(request: LoginRequest) {
  return getResult<LoginResult>(umcClient.post("auth/login", { json: request }));
}

export function signUp(request: SignUpRequest) {
  return getResult<SignUpResult>(umcClient.post("members", { json: request }));
}

export function getMyInfo(signal?: AbortSignal) {
  return getResult<MemberInfo>(umcClient.get("members/me", { signal }));
}

export function updateMyInfo(nickname: string) {
  return getResult<MemberInfo>(
    umcClient.patch("members/me", { json: { nickname } }),
  );
}

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
