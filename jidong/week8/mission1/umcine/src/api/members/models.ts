interface AvailabilityResponse {
  available: boolean;
}

interface MemberRatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export type { AvailabilityResponse, MemberRatingResponse };
