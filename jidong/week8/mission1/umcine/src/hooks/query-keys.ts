// 같은 데이터를 여러 화면에서 쓰니까 query key를 한 곳에 모아서 오타로 캐시가 갈라지는 걸 막음
export const queryKeys = {
  me: ["members", "me"] as const,
  memberRatings: (memberId: number) => ["members", memberId, "ratings"] as const,
  favorites: ["favorites"] as const,
  favoriteStatus: (movieId: number) => ["favorites", movieId] as const,
  movieDetail: (movieId: number) => ["movies", "detail", movieId] as const,
};
