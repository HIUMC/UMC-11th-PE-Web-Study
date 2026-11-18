import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteStatus } from "./models";

// 특정 영화의 즐겨찾기 여부
export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteApiResponse<FavoriteStatus>>();
  return response.result;
}
