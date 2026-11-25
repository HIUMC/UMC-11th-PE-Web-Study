import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteItem } from "./models";

// 내 즐겨찾기 목록 (최신 등록 순, 비어 있으면 빈 배열)
export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi
    .get("favorites")
    .json<FavoriteApiResponse<FavoriteItem[]>>();
  return response.result;
}
