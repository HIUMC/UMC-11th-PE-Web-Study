// 등록 응답과 목록의 각 항목에 들어가는 데이터
export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}
