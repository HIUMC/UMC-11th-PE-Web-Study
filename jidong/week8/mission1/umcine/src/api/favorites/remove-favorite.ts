import { authApi } from "../auth-api";

export async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
