import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  addFavoriteMutationOptions,
  favoritesQueryOptions,
  favoriteStatusQueryOptions,
  removeFavoriteMutationOptions,
} from "../api/favorite-queries";
import { useIsLoggedIn } from "../stores/auth-store";

export function useFavoriteToggle(movieId: number, source: "list" | "status") {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const currentHref = useRouterState({ select: (state) => state.location.href });
  const listQuery = useQuery({
    ...favoritesQueryOptions(),
    enabled: isLoggedIn && source === "list",
  });
  const statusQuery = useQuery({
    ...favoriteStatusQueryOptions(movieId),
    enabled: isLoggedIn && source === "status",
  });
  const addMutation = useMutation(addFavoriteMutationOptions());
  const removeMutation = useMutation(removeFavoriteMutationOptions());

  const isFavorite =
    isLoggedIn &&
    (source === "list"
      ? (listQuery.data?.some((favorite) => favorite.movieId === movieId) ??
        false)
      : (statusQuery.data?.isFavorite ?? false));
  const isPending = addMutation.isPending || removeMutation.isPending;

  function toggle() {
    if (!isLoggedIn) {
      navigate({ to: "/login", search: { redirect: currentHref } });
      return;
    }
    if (isPending) {
      return;
    }
    if (isFavorite) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate(movieId);
    }
  }

  return {
    isFavorite,
    isPending,
    toggle,
    error: addMutation.error ?? removeMutation.error,
  };
}
