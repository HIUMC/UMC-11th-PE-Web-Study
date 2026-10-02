import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],

      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),

      merge: (persistedState, currentState) => {
        if (
          typeof persistedState !== "object" ||
          persistedState === null ||
          !("bookmarkedMovieIds" in persistedState)
        ) {
          return currentState;
        }

        const storedIds = persistedState.bookmarkedMovieIds;

        if (!Array.isArray(storedIds)) {
          return currentState;
        }

        const validIds = storedIds.filter(
          (id): id is number =>
            typeof id === "number" &&
            Number.isInteger(id) &&
            id > 0,
        );

        return {
          ...currentState,
          bookmarkedMovieIds: [...new Set(validIds)],
        };
      },
    },
  ),
);