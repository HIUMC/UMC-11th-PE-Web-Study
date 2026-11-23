import { useQuery } from "@tanstack/react-query";
import { accountKeys } from "../api/account-session";
import { getMe } from "../api/members/account-api";
import { getFavorites, getFavoriteStatus, getMemberRatings } from "../api/movies/member-movie-api";
import { useAuthStore } from "../stores/auth-store";

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);

  return useQuery({
    queryKey: accountKeys.me(sessionId),
    queryFn: ({ signal }) => getMe(sessionId, signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useFavorites(sessionId: number) {
  return useQuery({
    queryKey: accountKeys.favorites(sessionId),
    queryFn: ({ signal }) => getFavorites(sessionId, signal),
    retry: false,
  });
}

export function useFavoriteStatus(sessionId: number, movieId: number) {
  return useQuery({
    queryKey: accountKeys.favorite(sessionId, movieId),
    queryFn: ({ signal }) => getFavoriteStatus(sessionId, movieId, signal),
    retry: false,
  });
}

export function useMemberRatings(sessionId: number, memberId: number) {
  return useQuery({
    queryKey: accountKeys.ratings(sessionId, memberId),
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
  });
}
