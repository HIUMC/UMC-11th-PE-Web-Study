import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteStatusQueryOptions } from "../api/favorites/favorites";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
} from "../hooks/use-favorite-mutation";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const favoriteStatusQuery = useQuery(
    favoriteStatusQueryOptions(movieId, isLoggedIn),
  );
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isBookmarked = Boolean(favoriteStatusQuery.data?.isFavorite);
  const isPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      alert("로그인 후 즐겨찾기를 이용할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }

    if (isPending) return;

    if (isBookmarked) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate(movieId);
    }
  };

  return (
    <button
      type="button"
      disabled={isPending}
      className={cn(
        "flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50",
        isBookmarked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "bg-[#17191E] hover:bg-[#0f172a]",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={handleClick}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt="북마크"
        className="h-6 w-6 brightness-0 invert filter"
      />
    </button>
  );
}
