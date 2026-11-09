import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface BookmarkState {
  bookmarkedIds: number[]
  toggleBookmark: (movieId: number) => void
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarkedIds: [],
      toggleBookmark: (movieId) => set((state) => ({
        bookmarkedIds: state.bookmarkedIds.includes(movieId)
          ? state.bookmarkedIds.filter((id) => id !== movieId)
          : [...state.bookmarkedIds, movieId],
      })),
    }),
    {
      name: 'umcine-bookmark-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarkedIds: state.bookmarkedIds }),
    },
  ),
)
