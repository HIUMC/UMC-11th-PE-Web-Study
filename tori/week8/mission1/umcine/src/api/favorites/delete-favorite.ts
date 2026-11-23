import { authApi } from "../auth-api";

interface DeleteFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export async function deleteFavorite(
  movieId: number,
): Promise<void> {
  await authApi
    .delete(`favorites/${movieId}`)
    .json<DeleteFavoriteResponse>();
}