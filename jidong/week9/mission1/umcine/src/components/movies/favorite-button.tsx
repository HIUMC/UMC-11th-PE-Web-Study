"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToggleFavoriteMutation } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
  isFavorite: boolean;
  variant?: "icon" | "label";
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  movieId,
  movieTitle,
  isFavorite,
  variant = "icon",
  disabled = false,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const actionLabel = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인하고 즐겨찾기를 사용할 수 있어요.");
      router.push(`/login?redirect=${encodeURIComponent(`/movies/${movieId}`)}`);
      return;
    }
    toggleFavoriteMutation.mutate({ movieId, isFavorite });
  };

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={`${movieTitle} ${actionLabel}`}
      onClick={handleClick}
      disabled={disabled || toggleFavoriteMutation.isPending}
      className={cn(
        "flex items-center justify-center rounded-md disabled:opacity-60",
        variant === "icon" && "h-7 w-7",
        variant === "label" && "gap-2 px-4 py-2 text-sm text-white",
        isFavorite
          ? "bg-blue-600"
          : variant === "icon"
            ? "bg-white/90"
            : "bg-gray-400",
        className,
      )}
    >
      <Image
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        width={16}
        height={16}
        className={cn("h-4 w-4", (isFavorite || variant === "label") && "invert")}
      />
      {variant === "label" && actionLabel}
    </button>
  );
}
