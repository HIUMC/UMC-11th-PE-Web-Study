import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";
import type { ApiResponse } from "../../types/api";

export interface UpdateMeRequest {
  nickname: string;
}

export function updateMe(body: UpdateMeRequest) {
  return authApi
    .patch("members/me", { json: body })
    .json<ApiResponse<MemberInfo>>();
}
