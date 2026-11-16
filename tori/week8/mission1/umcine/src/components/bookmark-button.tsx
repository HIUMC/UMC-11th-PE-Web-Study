import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "../stores/auth-store";
import { useCreateFavoriteMutation } from "../hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "../hooks/use-delete-favorite-mutation";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  isFavorite: boolean;
  disabled?: boolean;
}

export function BookmarkButton({
  movieId,
  isFavorite,
  disabled = false,
}: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const navigate = useNavigate();

  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isPending =
    createFavoriteMutation.isPending ||
    deleteFavoriteMutation.isPending;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }

    if (disabled || isPending) return;

    if (isFavorite) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate({ movieId });
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-white bg-gray-900",
        isFavorite && "border-primary bg-primary",
        (disabled || isPending) && "cursor-not-allowed opacity-50",
      )}
      aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isFavorite}
      disabled={disabled || isPending}
      onClick={handleClick}
    >
      <img
        className="h-[18px] w-[18px] brightness-0 invert"
        src={
          isFavorite
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}