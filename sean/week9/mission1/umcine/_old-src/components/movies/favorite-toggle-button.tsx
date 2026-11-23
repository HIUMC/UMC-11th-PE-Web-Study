import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BookmarkButton } from "./bookmark-button";
import { useFavoritesQuery, useToggleFavoriteMutation } from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";

interface FavoriteToggleButtonProps {
  movieId: number;
  className?: string;
  children?: ReactNode;
}

export function FavoriteToggleButton({
  movieId,
  className,
  children,
}: FavoriteToggleButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();

  const isFavorite =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;

  function handleToggle() {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (toggleMutation.isPending) return;

    toggleMutation.mutate({ movieId, isFavorite });
  }

  return (
    <BookmarkButton
      isFavorite={isFavorite}
      onToggle={handleToggle}
      disabled={toggleMutation.isPending}
      className={className}
    >
      {children}
    </BookmarkButton>
  );
}