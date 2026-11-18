import { queryClient } from "../config/query-client";
import { useAuthStore } from "../stores/auth-store";

export const accountKeys = {
  session: (sessionId: number) => ["account", sessionId] as const,
  me: (sessionId: number) => [...accountKeys.session(sessionId), "me"] as const,
  favorites: (sessionId: number) => [...accountKeys.session(sessionId), "favorites"] as const,
  favorite: (sessionId: number, movieId: number) =>
    [...accountKeys.favorites(sessionId), movieId] as const,
  ratings: (sessionId: number, memberId: number | null) =>
    [...accountKeys.session(sessionId), "ratings", memberId] as const,
};

export function changeSession(accessToken: string | null) {
  const previous = useAuthStore.getState();
  previous.setAccessToken(accessToken);
  const filters = { queryKey: accountKeys.session(previous.sessionId) };
  void queryClient.cancelQueries(filters);
  queryClient.removeQueries(filters);
  return useAuthStore.getState().sessionId;
}

export function isCurrentSession(sessionId: number) {
  const state = useAuthStore.getState();
  return Boolean(state.accessToken) && state.sessionId === sessionId;
}

export function readMemberId(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { sub } = JSON.parse(atob(payload)) as { sub?: unknown };
    if (typeof sub !== "string" || !/^[1-9]\d*$/.test(sub)) return null;
    const memberId = Number(sub);
    return Number.isSafeInteger(memberId) ? memberId : null;
  } catch {
    return null;
  }
}
