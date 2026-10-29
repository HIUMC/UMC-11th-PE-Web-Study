import { umcClient } from "../umc-client";

interface CheckResponse {
  available: boolean;
}

export function checkNickname(nickname: string) {
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

export type { CheckResponse };