import { apiClient } from "../api-client";

export interface checkEmailDuplicateResponse {
  available: boolean;
}

export function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<checkEmailDuplicateResponse>();
}
