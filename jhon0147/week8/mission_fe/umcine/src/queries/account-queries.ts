import { queryOptions } from "@tanstack/react-query";
import { account } from "../api/account";

export const accountKeys = {
  me: ["members", "me"] as const,
  favorites: (memberId: number | null) => ["favorites", memberId, "list"] as const,
  favoriteStatus: (memberId: number | null, movieId: number) => ["favorites", memberId, "status", movieId] as const,
  ratings: (memberId: number | null) => ["ratings", memberId] as const,
};

export function meOptions(accessToken: string | null) {
  return queryOptions({
    queryKey: accountKeys.me,
    queryFn: ({ signal }) => account.getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function favoritesOptions(memberId: number | null, enabled = true) {
  return queryOptions({
    queryKey: accountKeys.favorites(memberId),
    queryFn: ({ signal }) => account.getFavorites(signal),
    enabled: memberId !== null && enabled,
    retry: false,
  });
}

export function favoriteStatusOptions(memberId: number | null, movieId: number, enabled = true) {
  return queryOptions({
    queryKey: accountKeys.favoriteStatus(memberId, movieId),
    queryFn: ({ signal }) => account.getFavoriteStatus(movieId, signal),
    enabled: memberId !== null && enabled,
    retry: false,
  });
}

export function ratingsOptions(memberId: number | null) {
  return queryOptions({
    queryKey: accountKeys.ratings(memberId),
    queryFn: ({ signal }) => account.getRatings(memberId!, signal),
    enabled: memberId !== null,
    retry: false,
  });
}
