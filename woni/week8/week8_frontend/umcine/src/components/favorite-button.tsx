import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteQueries } from "../api/favorites/favorite-queries";
import { useCreateFavoriteMutation } from "../hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "../hooks/use-delete-favorite-mutation";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
}

// 서버 즐겨찾기 API와 연결된 버튼 (BookmarkButton text 형태와 같은 스타일)
export function FavoriteButton({ movieId, movieTitle }: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const favoriteStatusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: isLoggedIn,
  });
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isFavorite = isLoggedIn && favoriteStatusQuery.data?.isFavorite === true;
  const isBusy =
    createFavoriteMutation.isPending ||
    deleteFavoriteMutation.isPending ||
    (isLoggedIn && favoriteStatusQuery.isPending);

  const handleClick = () => {
    // 로그인하지 않았으면 로그인 페이지로 이동
    if (!isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    if (isBusy) return;

    if (isFavorite) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate({ movieId });
    }
  };

  const iconSrc = isFavorite
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? `${movieTitle} 즐겨찾기 해제` : `${movieTitle} 즐겨찾기`
      }
      disabled={isBusy}
      onClick={handleClick}
      className={cn(
        "flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50",
        isFavorite
          ? "bg-blue-600 text-white"
          : "border border-gray-300 bg-white text-[#17191e]",
      )}
    >
      <img
        src={iconSrc}
        alt=""
        className={cn("size-4 brightness-0", isFavorite && "invert")}
      />
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    </button>
  );
}
