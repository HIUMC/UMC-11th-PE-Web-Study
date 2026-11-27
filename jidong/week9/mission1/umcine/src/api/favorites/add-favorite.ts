import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

export async function addFavorite(movieId: number) {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
  return response.result;
}
