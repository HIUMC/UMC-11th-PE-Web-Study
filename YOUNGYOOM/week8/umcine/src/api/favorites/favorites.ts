import type { ApiResponse } from "../../types/api";
import type { Favorite, FavoriteStatus } from "../../types/favorite";
import { authApi } from "../auth-api";

function getFavorites() {
  return authApi.get("favorites").json<ApiResponse<Favorite[]>>();
}

function getFavoriteStatus(movieId: number) {
  return authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
}

function createFavorite(movieId: number) {
  // 요청 바디에는 TMDB 영화 ID만 보냄
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
}

function deleteFavorite(movieId: number) {
  // 해제 URL에도 favoriteId가 아닌 TMDB movieId를 사용
  // 서버가 200과 JSON을 반환하므로 응답 본문을 읽음
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

export { getFavorites, getFavoriteStatus, createFavorite, deleteFavorite };
