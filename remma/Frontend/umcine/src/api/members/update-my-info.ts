import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";
import type { MemberResult } from "./signup";

/** 변경할 항목만 담아서 보내요. */
export interface UpdateMyInfoRequest {
  nickname?: string;
  currentPassword?: string;
  newPassword?: string;
}

export type UpdateMyInfoResponse = ApiResponse<MemberResult>;

export function updateMyInfo(request: UpdateMyInfoRequest) {
  return apiClient
    .patch("members/me", { json: request })
    .json<UpdateMyInfoResponse>();
}
