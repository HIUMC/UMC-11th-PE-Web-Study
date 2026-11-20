import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

interface AddFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export async function addFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<AddFavoriteResponse>();

  return response.result;
}
