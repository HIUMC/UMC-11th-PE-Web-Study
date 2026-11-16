import { authApi } from "../auth-api";

interface FavoriteStatus {
  isFavorite: boolean;
}

interface FavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteStatus;
}

export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteStatusResponse>();

  return response.result;
}