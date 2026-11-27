export const queryKeys = {
  me: ["members", "me"] as const,
  memberRatings: (memberId: number) => ["members", memberId, "ratings"] as const,
  favorites: ["favorites"] as const,
  favoriteStatus: (movieId: number) => ["favorites", movieId] as const,
  movieDetail: (movieId: number) => ["movies", "detail", movieId] as const,
};
