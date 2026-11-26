"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMemberErrorMessage } from "../../api/api-client";
import { useFavoriteMutation } from "../../hooks/use-favorite-mutation";
import { favoriteStatusOptions, favoritesOptions } from "../../queries/account-queries";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberId } from "../../utils/member-id";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({ movieId, movieTitle, variant = "text", className }: BookmarkButtonProps) {
  const accessToken = useAuthStore(state => state.accessToken);
  const memberId = getMemberId(accessToken);
  const router = useRouter();
  // 목록의 카드들은 같은 query를 공유하고, 상세 화면은 해당 영화의 여부를 조회
  const favorites = useQuery(favoritesOptions(memberId, variant === "icon"));
  const status = useQuery(favoriteStatusOptions(memberId, movieId, variant === "text"));
  const query = variant === "icon" ? favorites : status;
  const mutation = useFavoriteMutation();
  const isFavorite = variant === "icon"
    ? Boolean(favorites.data?.some(item => item.movieId === movieId)) : Boolean(status.data?.isFavorite);
  const label = `${movieTitle} 즐겨찾기 ${isFavorite ? "해제" : "추가"}`;
  const error = mutation.error || query.error;
  const message = error ? getMemberErrorMessage(error, "즐겨찾기를 변경하지 못했어요.") : "";

  function handleClick() {
    if (!accessToken) { router.push("/login"); return; }
    if (memberId === null || mutation.isPending || query.isLoading) return;
    if (query.isError) { void query.refetch(); return; }
    mutation.mutate({ movieId, isFavorite });
  }

  return <>
    <button type="button" aria-label={query.isError ? `${movieTitle} 즐겨찾기 다시 조회` : label} aria-pressed={isFavorite}
      disabled={mutation.isPending || (Boolean(accessToken) && (query.isLoading || memberId === null))}
      aria-busy={mutation.isPending} onClick={handleClick} title={message || label}
      className={cn(
        "cursor-pointer font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-60",
        variant === "icon" ? "absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-[9px] border-2 border-white/90 shadow-md backdrop-blur-sm" : "inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm text-white shadow-sm",
        isFavorite ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900/90 hover:bg-slate-800",
        className,
      )}>
      <img className={cn("invert", variant === "icon" ? "size-6" : "size-5")} src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
      {variant === "text" && (mutation.isPending ? "변경 중" : query.isLoading ? "조회 중" : query.isError ? "다시 조회" : isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가")}
    </button>
    {message && <p role="alert" className={variant === "icon" ? "absolute inset-x-2 bottom-9 rounded bg-white/95 p-2 text-xs text-red-700" : "mt-2 text-sm text-red-700"}>{message}</p>}
  </>;
}
