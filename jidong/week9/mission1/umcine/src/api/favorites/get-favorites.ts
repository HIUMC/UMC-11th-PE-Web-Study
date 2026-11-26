import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

export async function getFavorites() {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
