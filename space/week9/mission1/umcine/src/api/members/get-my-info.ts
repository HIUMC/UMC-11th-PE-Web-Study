import { authApi } from "../auth-api";
import type { ApiResponse } from "./login";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export function getMyInfo(signal?: AbortSignal) {
  return authApi.get("members/me", { signal, retry: 0 }).json<ApiResponse<MemberInfo>>();
}
