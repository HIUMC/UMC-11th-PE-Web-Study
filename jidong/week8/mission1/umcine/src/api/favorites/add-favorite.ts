import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

// memberId는 안 보냄. 서버가 토큰에서 회원을 알아냄
export async function addFavorite(movieId: number) {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
  return response.result;
}
