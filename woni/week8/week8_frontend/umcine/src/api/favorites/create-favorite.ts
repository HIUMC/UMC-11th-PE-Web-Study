import { authApi } from "../auth-api";
import type { FavoriteApiResponse, FavoriteItem } from "./models";

export interface CreateFavoriteRequest {
  movieId: number;
}

// 즐겨찾기 등록 (이미 등록된 영화면 409 FAVORITE409_1)
export function createFavorite(body: CreateFavoriteRequest) {
  return authApi
    .post("favorites", { json: body })
    .json<FavoriteApiResponse<FavoriteItem>>();
}
