"use client";

import { useDeleteFavoriteMutation } from "../hooks/use-delete-favorite-mutation";

interface FavoriteRemoveButtonProps {
  movieId: number;
  movieTitle: string;
}

// 마이페이지 카드용 버튼: 목록의 영화는 모두 즐겨찾기이므로 누르면 서버에서 해제
// BookmarkButton icon 형태의 눌린 상태와 같은 스타일
export function FavoriteRemoveButton({
  movieId,
  movieTitle,
}: FavoriteRemoveButtonProps) {
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  return (
    <button
      type="button"
      aria-pressed={true}
      aria-label={`${movieTitle} 즐겨찾기 해제`}
      disabled={deleteFavoriteMutation.isPending}
      onClick={() => deleteFavoriteMutation.mutate(movieId)}
      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/bookmark.svg"
        alt=""
        className="size-4 brightness-0 invert"
      />
    </button>
  );
}
