import { authApi } from "../auth-api";
import type { Favorite } from "./models";

interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();
  return response.result;
}
