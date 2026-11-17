import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Rating, RatingInput } from "../types/member";
import { queryClient } from "./query-client";
import {
  createRating,
  deleteRating,
  getAllMemberRatings,
  updateRating,
} from "./ratings-api";

export const ratingKeys = {
  member: (memberId: number) => ["ratings", "member", memberId] as const,
};

export function memberRatingsQueryOptions(memberId: number) {
  return queryOptions({
    queryKey: ratingKeys.member(memberId),
    queryFn: ({ signal }) => getAllMemberRatings(memberId, signal),
  });
}

function updateCachedRatings(
  memberId: number,
  update: (ratings: Rating[]) => Rating[],
) {
  queryClient.setQueryData<Rating[]>(ratingKeys.member(memberId), (ratings) =>
    ratings ? update(ratings) : ratings,
  );
}

export function createRatingMutationOptions(memberId: number) {
  return mutationOptions({
    mutationKey: ["ratings", "create"],
    mutationFn: ({ movieId, ...input }: RatingInput & { movieId: number }) =>
      createRating(movieId, input),
    onSuccess: (rating) => {
      updateCachedRatings(memberId, (ratings) => [rating, ...ratings]);
    },
  });
}

export function updateRatingMutationOptions(memberId: number) {
  return mutationOptions({
    mutationKey: ["ratings", "update"],
    mutationFn: ({ ratingId, ...input }: RatingInput & { ratingId: number }) =>
      updateRating(ratingId, input),
    onSuccess: (rating) => {
      updateCachedRatings(memberId, (ratings) =>
        ratings.map((item) => (item.ratingId === rating.ratingId ? rating : item)),
      );
    },
  });
}

export function deleteRatingMutationOptions(memberId: number) {
  return mutationOptions({
    mutationKey: ["ratings", "delete"],
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: (_result, ratingId) => {
      updateCachedRatings(memberId, (ratings) =>
        ratings.filter((item) => item.ratingId !== ratingId),
      );
    },
  });
}
