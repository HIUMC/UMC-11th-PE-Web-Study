import type { KyInstance } from "ky";
import type { ApiResponse, Favorite, FavoriteStatus, LoginRequest, LoginResult, MemberInfo, Rating, RatingInput } from "../types/account";

async function result<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  const response = await request;
  if (!response.isSuccess) throw new Error(response.message || "요청을 처리하지 못했어요.");
  return response.result;
}

export function createAccountService(client: KyInstance) {
  return {
    login: (body: LoginRequest) => result(client.post("auth/login", {
      json: { email: body.email.trim(), password: body.password },
    }).json<ApiResponse<LoginResult>>()),
    getMe: (signal?: AbortSignal) => result(client.get("members/me", { signal }).json<ApiResponse<MemberInfo>>()),
    updateMe: (body: { nickname: string }) => result(client.patch("members/me", {
      json: { nickname: body.nickname.trim() },
    }).json<ApiResponse<MemberInfo>>()),
    getFavorites: (signal?: AbortSignal) => result(client.get("favorites", { signal }).json<ApiResponse<Favorite[]>>()),
    getFavoriteStatus: (movieId: number, signal?: AbortSignal) => result(client.get(`favorites/${movieId}`, { signal }).json<ApiResponse<FavoriteStatus>>()),
    addFavorite: (movieId: number) => result(client.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>()),
    removeFavorite: (movieId: number) => result(client.delete(`favorites/${movieId}`).json<ApiResponse<null>>()),
    // 이 API의 성공 응답은 result로 감싸지 않은 배열
    getRatings: (memberId: number, signal?: AbortSignal) => client.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>(),
    createRating: (body: RatingInput & { movieId: number }) => result(client.post("ratings", { json: body }).json<ApiResponse<Rating>>()),
    updateRating: ({ ratingId, ...body }: RatingInput & { ratingId: number }) => result(client.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>()),
    removeRating: (ratingId: number) => result(client.delete(`ratings/${ratingId}`).json<ApiResponse<null>>()),
  };
}
