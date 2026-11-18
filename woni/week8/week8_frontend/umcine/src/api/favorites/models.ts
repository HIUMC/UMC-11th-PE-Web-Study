// 백엔드 공통 응답 형태 (isSuccess, code, message, result)
export interface FavoriteApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 백엔드 FavoriteResponse
export interface FavoriteItem {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

// 백엔드 FavoriteStatusResponse
export interface FavoriteStatus {
  isFavorite: boolean;
}
