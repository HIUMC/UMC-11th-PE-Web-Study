import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getFavorite } from "../../api/favorites";
import { useFavoriteMutation } from "../../hooks/use-favorite-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps { movieId: number; movieTitle: string; className?: string; }

export default function BookmarkButton({ movieId, movieTitle, className }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const favoriteQuery = useQuery({ queryKey: ["favorites", movieId], queryFn: () => getFavorite(movieId), enabled: Boolean(accessToken), retry: false });
  const favoriteMutation = useFavoriteMutation(movieId);
  const isFavorite = Boolean(favoriteQuery.data);
  const toggle = () => {
    if (!accessToken) { navigate({ to: "/login" }); return; }
    favoriteMutation.mutate(isFavorite, { onSuccess: () => favoriteQuery.refetch() });
  };
  return <button className={cn("inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:bg-zinc-400", className)} type="button" aria-label={isFavorite ? `${movieTitle} 즐겨찾기 해제` : `${movieTitle} 즐겨찾기 추가`} aria-pressed={isFavorite} disabled={favoriteQuery.isLoading || favoriteMutation.isPending} onClick={toggle}>{isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}</button>;
}
