import { mutationOptions } from "@tanstack/react-query";
import { account, login } from "../api/account";
import { signup } from "../api/members/signup";

export const signupOptions = mutationOptions({ mutationKey: ["signup"], mutationFn: signup });
export const loginOptions = mutationOptions({ mutationKey: ["login"], mutationFn: login });
export const updateMeOptions = mutationOptions({ mutationKey: ["update-me"], mutationFn: account.updateMe });
export const favoriteMutationOptions = mutationOptions({
  mutationKey: ["change-favorite"],
  mutationFn: ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) =>
    isFavorite ? account.removeFavorite(movieId) : account.addFavorite(movieId),
});
export const createRatingOptions = mutationOptions({ mutationKey: ["create-rating"], mutationFn: account.createRating });
export const updateRatingOptions = mutationOptions({ mutationKey: ["update-rating"], mutationFn: account.updateRating });
export const deleteRatingOptions = mutationOptions({ mutationKey: ["delete-rating"], mutationFn: account.removeRating });
