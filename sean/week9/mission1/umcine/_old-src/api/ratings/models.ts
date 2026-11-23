export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}