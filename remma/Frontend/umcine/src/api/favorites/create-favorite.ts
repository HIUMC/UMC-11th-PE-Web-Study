import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { CreateFavoriteRequest, FavoriteItem } from "./models";

export type CreateFavoriteResponse = ApiResponse<FavoriteItem>;

export function createFavorite(request: CreateFavoriteRequest) {
  return authApi
    .post("favorites", { json: request })
    .json<CreateFavoriteResponse>();
}
