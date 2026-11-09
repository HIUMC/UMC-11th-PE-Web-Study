import { useMemo } from "react";
import { movies as initialMovies } from "../data/movies";
import { useBookmarkStore } from "../stores/bookmark-store";

export function useMovies() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const movies = useMemo(
    () =>
      initialMovies.map((movie) => ({
        ...movie,
        isBookmarked: bookmarkedMovieIds.includes(movie.id),
      })),
    [bookmarkedMovieIds],
  );

  return { movies, toggleBookmark };
}