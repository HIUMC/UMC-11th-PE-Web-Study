import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { FavoriteStatus } from "./models";

// 즐겨찾기 안 했어도 오류가 아니라 isFavorite: false로 옴
export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
