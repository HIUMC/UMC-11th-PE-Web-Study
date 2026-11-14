import { apiClient } from "../api-client";

export interface checkNicknameDuplicateResponse {
  available: boolean;
}

export function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<checkNicknameDuplicateResponse>();
}
