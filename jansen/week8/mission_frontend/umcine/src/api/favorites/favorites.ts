import type { ApiResult } from "../api-types";
import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

// 내 즐겨찾기 목록 (최신 등록순)
export async function getFavorites() {
  const response = await authApi.get("favorites").json<ApiResult<Favorite[]>>();
  return response.result;
}

// 특정 영화 즐겨찾기 여부 (없어도 200, isFavorite: false)
export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResult<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export function addFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResult<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResult<null>>();
}
