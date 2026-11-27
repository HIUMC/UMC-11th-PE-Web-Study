import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { FavoriteStatus } from "./models";

export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
