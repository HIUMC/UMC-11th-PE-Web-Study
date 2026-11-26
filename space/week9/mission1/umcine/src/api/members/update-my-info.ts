import { authApi } from "../auth-api";
import type { ApiResponse } from "./login";
import type { MemberInfo } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export function updateMyInfo(body: UpdateMyInfoRequest) {
  return authApi
    .patch("members/me", { json: body })
    .json<ApiResponse<MemberInfo>>();
}
