import { queryOptions } from "@tanstack/react-query";
import { getFavoriteStatus } from "./get-favorite-status";
import { getFavorites } from "./get-favorites";

// ["favorites"]는 목록, ["favorites", movieId]는 영화별 즐겨찾기 여부
// ["favorites"]로 무효화하면 목록과 영화별 여부가 함께 무효화됨
export const favoriteQueries = {
  all: () => ["favorites"] as const,
  list: () =>
    queryOptions({
      queryKey: favoriteQueries.all(),
      queryFn: getFavorites,
    }),
  status: (movieId: number) =>
    queryOptions({
      queryKey: [...favoriteQueries.all(), movieId],
      queryFn: () => getFavoriteStatus(movieId),
    }),
};
