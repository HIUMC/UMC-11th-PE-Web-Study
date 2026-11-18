import { authApi } from "../auth-api";
import type { FavoriteApiResponse } from "./models";

// 즐겨찾기 해제 (등록되지 않은 영화면 404 FAVORITE404_1)
export function deleteFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<FavoriteApiResponse<null>>();
}
