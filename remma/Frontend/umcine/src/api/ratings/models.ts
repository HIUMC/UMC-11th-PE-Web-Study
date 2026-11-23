export interface RatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export interface UpdateRatingRequest {
  score: number;
  comment: string | null;
}

export interface UpdateRatingVariables {
  ratingId: number;
  body: UpdateRatingRequest;
}
