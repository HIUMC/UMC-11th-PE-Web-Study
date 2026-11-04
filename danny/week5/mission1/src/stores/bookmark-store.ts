import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (movieId: number) => void;
}

function isMovieIdList(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarkedIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(movieId)
            ? state.bookmarkedIds.filter((id) => id !== movieId)
            : [...state.bookmarkedIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarkedIds: state.bookmarkedIds }),
      merge: (persistedState, currentState) => {
        const bookmarkedIds = (
          persistedState as { bookmarkedIds?: unknown } | undefined
        )?.bookmarkedIds;

        return {
          ...currentState,
          bookmarkedIds: isMovieIdList(bookmarkedIds) ? bookmarkedIds : [],
        };
      },
    },
  ),
);
