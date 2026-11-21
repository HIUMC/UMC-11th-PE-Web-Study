import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteStatus,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";
import bookmark from "../../public/icons/bookmark-outline.svg";

interface BookmarkButtonProps {
  movieId: number;
  children?: ReactNode;
}

export function BookmarkButton({ movieId, children }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useAuthStore((state) => state.memberId);
  const queryClient = useQueryClient();
  const canLoad = Boolean(accessToken) && memberId != null;

  const favoriteQuery = useQuery({
    queryKey: ["favorites", memberId, "status", movieId],
    queryFn: async () => {
      // 서버에서 현재 영화의 즐겨찾기 여부를 가져옴
      const response = await getFavoriteStatus(movieId);
      return response.result.isFavorite;
    },
    enabled: canLoad,
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (isBookmarked: boolean) => {
      // 이미 등록된 영화는 해제하고, 등록되지 않은 영화는 추가
      if (isBookmarked) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },
    onSuccess: () => {
      // 영화 상세의 버튼 상태와 마이페이지의 즐겨찾기 목록을 갱신
      return queryClient.invalidateQueries({
        queryKey: ["favorites", memberId],
      });
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });

  const isBookmarked = canLoad && favoriteQuery.data === true;

  const handleClick = () => {
    if (!accessToken) {
      alert("즐겨찾기를 사용하려면 로그인해 주세요.");
      return;
    }

    if (!canLoad || favoriteMutation.isPending) return;

    // 조회에 실패한 경우 버튼을 다시 누르면 상태 조회부터 재시도
    if (favoriteQuery.isError) {
      void favoriteQuery.refetch();
      return;
    }

    if (favoriteQuery.isSuccess) {
      favoriteMutation.mutate(favoriteQuery.data);
    }
  };

  return (
    <button
      type="button"
      aria-label={
        favoriteQuery.isError ? "즐겨찾기 상태 다시 조회" : "즐겨찾기"
      }
      aria-pressed={isBookmarked}
      disabled={
        Boolean(accessToken) &&
        (!canLoad || favoriteQuery.isPending || favoriteMutation.isPending)
      }
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-colors disabled:opacity-50",
        children ? "w-fit px-6 py-3" : "w-8",
        isBookmarked
          ? "bg-blue-600 text-white"
          : "border border-gray-500 bg-gray-100 text-gray-700 hover:bg-gray-200",
      )}
      onClick={handleClick}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
        className="size-5 shrink-0"
      />
      {children}
    </button>
  );
}
