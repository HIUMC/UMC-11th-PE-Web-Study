import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";

export type DeleteFavoriteResponse = ApiResponse<null>;

export function deleteFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<DeleteFavoriteResponse>();
}
