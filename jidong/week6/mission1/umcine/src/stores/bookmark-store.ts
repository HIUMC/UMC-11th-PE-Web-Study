import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 저장값은 사용자가 개발자 도구에서 바꿀 수 있으므로 양의 정수 ID만 남겨요.
function toValidMovieIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (movieId): movieId is number => Number.isInteger(movieId) && movieId > 0,
  );
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
      merge: (persistedState, currentState) => ({
        ...currentState,
        bookmarkedMovieIds: toValidMovieIds(
          (persistedState as Partial<BookmarkStore> | undefined)
            ?.bookmarkedMovieIds,
        ),
      }),
    },
  ),
);
