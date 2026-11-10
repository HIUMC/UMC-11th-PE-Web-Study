import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (movieId: number) => void;
  isBookmarked: (movieId: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(movieId)
            ? state.bookmarkedIds.filter((id) => id !== movieId)
            : [...state.bookmarkedIds, movieId],
        })),
      isBookmarked: (movieId) => get().bookmarkedIds.includes(movieId),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarkedIds: state.bookmarkedIds }),
    },
  ),
);
