export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface AvailabilityResponse {
  available: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  nickname: string;
  accessToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignUpResult {
  memberId: number;
  email: string;
  nickname: string;
}

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingPage {
  ratings: Rating[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}
