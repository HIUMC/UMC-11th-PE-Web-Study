import { apiClient } from "../api-client";

export interface EmailCheckResponse {
  available: boolean;
}

export function checkEmail(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<EmailCheckResponse>();
}
