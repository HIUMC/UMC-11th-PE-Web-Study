// 백엔드 공통 응답 형태 (등록, 수정, 삭제에서 사용)
export interface RatingApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 백엔드 RatingResponse
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
