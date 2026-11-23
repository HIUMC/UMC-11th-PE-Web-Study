import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "./favorites-api";
import { queryClient } from "./query-client";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  status: (movieId: number) =>
    [...favoriteKeys.all, "status", movieId] as const,
};

export function favoritesQueryOptions() {
  return queryOptions({
    queryKey: favoriteKeys.list(),
    queryFn: ({ signal }) => getFavorites(signal),
  });
}

export function favoriteStatusQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: favoriteKeys.status(movieId),
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
  });
}

function resyncOnConflict(error: Error) {
  if (isHTTPError(error) && [404, 409].includes(error.response.status)) {
    return queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
  }
}

export function addFavoriteMutationOptions() {
  return mutationOptions({
    mutationKey: ["favorites", "add"],
    mutationFn: (movieId: number) => addFavorite(movieId),
    onSuccess: (_favorite, movieId) => {
      queryClient.setQueryData(favoriteKeys.status(movieId), {
        isFavorite: true,
      });
      return queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
    onError: resyncOnConflict,
  });
}

export function removeFavoriteMutationOptions() {
  return mutationOptions({
    mutationKey: ["favorites", "remove"],
    mutationFn: (movieId: number) => removeFavorite(movieId),
    onSuccess: (_result, movieId) => {
      queryClient.setQueryData(favoriteKeys.status(movieId), {
        isFavorite: false,
      });
      return queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
    onError: resyncOnConflict,
  });
}
