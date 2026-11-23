import { apiClient } from "../api-client";

export interface NicknameCheckResponse {
  available: boolean;
}

export function checkNickname(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<NicknameCheckResponse>();
}
