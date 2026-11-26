export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  nickname: string;
  accessToken: string;
}

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}
