export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 평점 조회 응답에서 화면에 사용할 필드
export interface MemberRatingsPage {
  content: Rating[];
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export interface CreateRatingRequest extends UpdateRatingRequest {
  movieId: number;
}
