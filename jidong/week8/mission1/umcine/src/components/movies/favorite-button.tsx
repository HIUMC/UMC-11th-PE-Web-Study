import { useNavigate } from "@tanstack/react-router";
import { useToggleFavoriteMutation } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
  // 서버에서 받은 즐겨찾기 여부 (상세는 GET /favorites/{movieId}, 카드는 GET /favorites 목록에서 계산)
  isFavorite: boolean;
  // icon: 포스터 위 작은 버튼, label: 상세 화면 글자 버튼
  variant?: "icon" | "label";
  disabled?: boolean;
  className?: string;
}

// 4주차 북마크(localStorage)를 서버 즐겨찾기 API로 바꿈
export function FavoriteButton({
  movieId,
  movieTitle,
  isFavorite,
  variant = "icon",
  disabled = false,
  className,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const actionLabel = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";

  const handleClick = () => {
    // 즐겨찾기는 로그인한 회원의 데이터라 토큰이 없으면 로그인 화면으로 보냄
    if (!accessToken) {
      alert("로그인하고 즐겨찾기를 사용할 수 있어요.");
      navigate({ to: "/login", search: { redirect: `/movies/${movieId}` } });
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
      <img
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className={cn("h-4 w-4", (isFavorite || variant === "label") && "invert")}
      />
      {variant === "label" && actionLabel}
    </button>
  );
}
