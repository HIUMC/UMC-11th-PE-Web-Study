import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountKeys, isCurrentSession } from "../api/account-session";
import { readMemberApiError } from "../api/api-client";
import { login, updateMe } from "../api/members/account-api";
import { signup } from "../api/members/member-api";
import { deleteRating, saveRating, setFavorite } from "../api/movies/member-movie-api";

const writeDefaults = { retry: false, networkMode: "always" } as const;

export const accountMutationOptions = {
  signup: () => mutationOptions({ ...writeDefaults, mutationFn: signup, gcTime: 0 }),
  login: () => mutationOptions({ ...writeDefaults, mutationFn: login, gcTime: 0 }),
  favorite: (sessionId: number, movieId: number) => mutationOptions({
    ...writeDefaults,
    mutationFn: (add: boolean) => setFavorite(sessionId, movieId, add),
  }),
};

export function useUpdateMeMutation(sessionId: number) {
  const client = useQueryClient();
  return useMutation({
    ...writeDefaults,
    mutationFn: (nickname: string) => updateMe(sessionId, nickname),
    onMutate: () => client.cancelQueries({ queryKey: accountKeys.me(sessionId), exact: true }),
    onSuccess: (member) => {
      if (isCurrentSession(sessionId)) {
        client.setQueryData(accountKeys.me(sessionId), member);
      }
    },
  });
}

export function useFavoriteMutation(sessionId: number, movieId: number) {
  const client = useQueryClient();

  function refresh() {
    if (!isCurrentSession(sessionId)) return;
    return client.invalidateQueries({ queryKey: accountKeys.favorites(sessionId) });
  }

  return useMutation({
    ...accountMutationOptions.favorite(sessionId, movieId),
    onSuccess: refresh,
    onError: (error, add) => {
      const { status } = readMemberApiError(error);
      if ((add && status === 409) || (!add && status === 404)) return refresh();
    },
  });
}

type RatingWrite =
  | { action: "save"; score: number; comment: string; ratingId?: number }
  | { action: "delete"; ratingId: number };

export function useRatingMutation(sessionId: number, memberId: number, movieId: number) {
  const client = useQueryClient();

  function refresh() {
    if (!isCurrentSession(sessionId)) return;
    return client.invalidateQueries({ queryKey: accountKeys.ratings(sessionId, memberId) });
  }

  return useMutation({
    ...writeDefaults,
    mutationFn: (write: RatingWrite) => write.action === "delete"
      ? deleteRating(sessionId, write.ratingId)
      : saveRating(sessionId, movieId, { score: write.score, comment: write.comment }, write.ratingId),
    onSuccess: refresh,
    onError: (error) => {
      const { status } = readMemberApiError(error);
      if (status === 404 || status === 409) return refresh();
    },
  });
}
