import { apiClient } from "../api-client";

interface CheckResponse {
  available: boolean;
}

export function checkNickname(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

export type { CheckResponse };