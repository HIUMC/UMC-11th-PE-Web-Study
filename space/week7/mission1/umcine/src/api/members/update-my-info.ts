import { apiClient } from "../api-client";
import type { ApiResponse } from "./login";
import type { MemberInfo } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export function updateMyInfo(body: UpdateMyInfoRequest) {
  return apiClient
    .patch("members/me", { json: body })
    .json<ApiResponse<MemberInfo>>();
}
