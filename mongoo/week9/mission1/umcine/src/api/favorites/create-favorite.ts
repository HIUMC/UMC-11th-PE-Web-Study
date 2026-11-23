import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export function createFavorite(movieId: number) {
  return authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<CreateFavoriteResponse>();
}