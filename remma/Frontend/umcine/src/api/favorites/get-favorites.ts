import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { FavoriteItem } from "./models";

export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<FavoriteItem[]> | FavoriteItem[]>();

  if (Array.isArray(response)) {
    return response;
  }

  return response.result ?? [];
}
