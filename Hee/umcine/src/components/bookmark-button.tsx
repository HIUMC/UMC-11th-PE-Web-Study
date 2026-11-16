import { useFavorites, useToggleFavorite } from "../hooks/use-favorites";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const favoritesQuery = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isBookmarked = favoritesQuery.data?.includes(movieId) ?? false;

  return (
    <button
      type="button"
      disabled={toggleFavorite.isPending}
      onClick={() => toggleFavorite.mutate({ movieId, isFavorite: isBookmarked })}
    >
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}
