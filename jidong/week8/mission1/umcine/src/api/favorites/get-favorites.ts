import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

// 내 즐겨찾기 목록 (최신 등록 순서)
export async function getFavorites() {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
