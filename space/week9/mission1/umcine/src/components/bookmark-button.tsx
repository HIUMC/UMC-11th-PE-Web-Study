"use client";

import { cn } from "../utils/cn";
import { useFavorite, useFavorites, useFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";
import { useIsMutating } from "@tanstack/react-query";
import { getApiErrorMessage } from "../utils/api-error-message";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "action";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const token = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const list = useFavorites();
  const detail = useFavorite(movieId, variant === "action");
  const mutation = useFavoriteMutation(movieId);
  const busy = useIsMutating({ mutationKey: ["favorites", movieId] }) > 0;
  const query = variant === "action" ? detail : list;
  const isBookmarked = variant === "action" ? detail.data?.isFavorite : list.data?.some((item) => item.movieId === movieId);
  function toggleBookmark() {
    if (!token) { void router.push("/login"); return; }
    if (query.isError) { void query.refetch(); return; }
    if (busy || query.isPending) return;
    mutation.mutate(Boolean(isBookmarked), { onError: (error) => alert(getApiErrorMessage(error, "즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.")) });
  }

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        variant === "card"
          ? "absolute right-2.5 top-2.5 z-[1] flex size-8.5 items-center justify-center rounded-lg border"
          : "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface outline outline-1 outline-offset-[-1px] outline-bg-surface",
        variant === "card" &&
          (isBookmarked
            ? "border-action-primary bg-action-primary"
            : "border-bg-surface bg-text-primary"),
      )}
      disabled={Boolean(token) && (busy || query.isLoading)}
      aria-pressed={Boolean(isBookmarked)}
      title={query.isError ? "즐겨찾기 조회 실패: 클릭하여 재시도" : undefined}
      onClick={toggleBookmark}
    >
      <img
        src={`/icons/${isBookmarked ? "bookmark.svg" : "bookmark-outline.svg"}`}
        alt=""
        aria-hidden="true"
        className={cn(
          "size-6 shrink-0 brightness-0 invert",
          variant === "action" && "size-4",
        )}
      />
      {variant === "action" && (
        <span>{isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}</span>
      )}
    </button>
  );
}