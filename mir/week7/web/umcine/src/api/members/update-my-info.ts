import { apiClient } from "../api-client";
import type { MemberInfoResponse } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export function updateMyInfo(accessToken: string, body: UpdateMyInfoRequest) {
  return apiClient
    .patch("members/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: body,
    })
    .json<MemberInfoResponse>();
}
