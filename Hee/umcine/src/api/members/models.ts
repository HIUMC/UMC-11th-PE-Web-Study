export type AvailabilityResponse = {
  available: boolean;
};

export type MemberRating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};
