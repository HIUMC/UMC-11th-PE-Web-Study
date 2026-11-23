"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";
import { BookmarkButton } from "./bookmark-button";

interface FavoriteToggleButtonProps {
  movieId: number;
  className?: string;
  children?: ReactNode;
}

/**
 * 목록·검색 화면용 즐겨찾기 버튼입니다.
 * 카드가 20개여도 queryKey가 전부 같은 ["favorites"]라 요청은 한 번만 나갑니다.
 */
export function FavoriteToggleButton({
  movieId,
  className,
  children,
}: FavoriteToggleButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();

  const isFavorite =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
    false;

  function handleToggle() {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      router.push("/login");
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
