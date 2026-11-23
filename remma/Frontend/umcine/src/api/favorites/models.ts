export interface FavoriteItem {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export interface CreateFavoriteRequest {
  movieId: number;
}
