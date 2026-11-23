import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../hooks/use-favorite-mutations";
import { useFavoritesQuery } from "../hooks/use-favorites-query";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle?: string;
  /** overlay: 포스터 위 아이콘 버튼, labeled: 아이콘 + 텍스트 버튼 */
  variant?: "overlay" | "labeled";
  className?: string;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "labeled",
  className,
}: BookmarkButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const isFavorite =
    Boolean(accessToken) &&
    (favoritesQuery.data?.some((item) => item.movieId === movieId) ?? false);

  const isPending =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const visibleLabel = isFavorite ? "즐겨찾기 해제" : "즐겨찾기";
  const overlayAriaLabel = movieTitle ? `${movieTitle} 즐겨찾기` : "즐겨찾기";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 카드처럼 링크 근처에 있을 때 상세 페이지로 이동하지 않도록 막아요.
    event.preventDefault();
    event.stopPropagation();

    if (!accessToken) {
      navigate({ to: "/login", search: { redirect: location.href } });
      return;
    }

    if (isPending) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate({ movieId });
    }
  };

  if (variant === "overlay") {
    return (
      <button
        type="button"
        aria-label={overlayAriaLabel}
        aria-pressed={isFavorite}
        disabled={isPending}
        onClick={handleClick}
        className={cn(
          "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60",
          isFavorite
            ? "bg-blue-600 text-white"
            : "bg-black/50 text-white/90 backdrop-blur-xs hover:bg-black/70",
          className,
        )}
      >
        <BookmarkIcon filled={isFavorite} />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60",
        isFavorite
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50",
        className,
      )}
    >
      <BookmarkIcon filled={isFavorite} />
      {movieTitle && <span className="sr-only">{movieTitle} </span>}
      {visibleLabel}
    </button>
  );
}
