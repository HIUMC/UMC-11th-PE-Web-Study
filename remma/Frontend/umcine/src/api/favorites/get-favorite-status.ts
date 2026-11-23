import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { FavoriteStatus } from "./models";

export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus> | FavoriteStatus>();

  if ("isFavorite" in response) {
    return response;
  }

  return response.result ?? { isFavorite: false };
}
