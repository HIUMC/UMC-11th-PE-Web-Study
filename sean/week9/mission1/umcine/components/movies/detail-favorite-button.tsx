"use client";

import { useRouter } from "next/navigation";
import {
  useFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";
import { BookmarkButton } from "./bookmark-button";

/**
 * 상세 화면용 즐겨찾기 버튼입니다.
 * 영화 하나만 궁금하므로 목록 전체 대신 GET /favorites/{movieId}를 씁니다.
 */
export function DetailFavoriteButton({ movieId }: { movieId: number }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);
  const toggleMutation = useToggleFavoriteMutation();

  const isFavorite = favoriteStatusQuery.data ?? false;

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
      className="mt-5 h-9 px-3 text-sm font-medium"
    >
      즐겨찾기
    </BookmarkButton>
  );
}
