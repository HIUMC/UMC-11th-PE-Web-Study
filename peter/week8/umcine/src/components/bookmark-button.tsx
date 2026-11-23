import { cn } from "../utils/cn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { getFavoriteStatus } from "@/api/favorites/get-favorites-status";
import { createFavorite } from "@/api/favorites/create-favorite";
import { deleteFavorite } from "@/api/favorites/delete-favorite";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "detail";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const isBookmarked =
    Boolean(accessToken) && favoriteStatusQuery.data?.isFavorite === true;

  const favoriteMutation = useMutation({
    mutationFn: async (nextIsFavorite: boolean) => {
      if (nextIsFavorite) {
        await createFavorite({ movieId });
      } else {
        await deleteFavorite(movieId);
      }
    },
    onSuccess: async (_data, nextIsFavorite) => {
      queryClient.setQueryData(
        ["favorites", "status", movieId],
        { isFavorite: nextIsFavorite },
      );

      await queryClient.invalidateQueries({
        queryKey: ["favorites", "list"],
      });
    },
    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });

  function handleClick() {
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }

    if (favoriteStatusQuery.isFetching || favoriteMutation.isPending) return;

    if (!favoriteStatusQuery.isSuccess) {
      void favoriteStatusQuery.refetch();
      return;
    }

    favoriteMutation.mutate(!isBookmarked);
  }

  const buttonLabel = favoriteMutation.isPending
    ? "즐겨찾기 변경 중"
    : favoriteStatusQuery.isError && accessToken
      ? "즐겨찾기 상태 다시 확인"
      : isBookmarked
        ? "북마크 해제"
        : "북마크 추가";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={favoriteStatusQuery.isLoading || favoriteMutation.isPending}
      aria-busy={favoriteStatusQuery.isLoading || favoriteMutation.isPending}
      aria-label={buttonLabel}
      aria-pressed={isBookmarked}
      className={cn(
        "flex items-center justify-center border text-white disabled:cursor-not-allowed disabled:opacity-50",

        variant === "card" &&
          "absolute top-2 right-2 h-[34px] w-[34px] rounded-lg p-0",

        variant === "detail" &&
          "h-[42px] w-[107px] gap-2 rounded-lg border-white bg-[#2563eb] px-4",

        variant === "card" &&
          (isBookmarked
            ? "border-blue-600 bg-blue-600"
            : "border-white bg-black/60"),
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className={cn(
          "block shrink-0 brightness-0 invert",
          variant === "card" ? "h-6 w-6" : "h-4 w-4",
        )}
      />

      <span
        className={cn(
          variant === "card" && "sr-only",
          variant === "detail" &&
            "text-center text-sm leading-none font-extrabold whitespace-nowrap",
        )}
      >
        {variant === "detail" ? "즐겨찾기" : buttonLabel}
      </span>
    </button>
  );
}