import { apiClient } from "../api-client";

export interface MemberInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    email: string;
    nickname: string;
    createdAt: string;
  };
}

export function getMyInfo(accessToken: string) {
  return apiClient
    .get("members/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<MemberInfoResponse>();
}
