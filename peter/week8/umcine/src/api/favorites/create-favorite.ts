import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

interface CreateFavoriteRequest {
  movieId: number;
}

interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export async function createFavorite(
  body: CreateFavoriteRequest,
): Promise<Favorite> {
  const response = await authApi
    .post("favorites", { json: body })
    .json<CreateFavoriteResponse>();

  return response.result;
}