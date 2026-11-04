import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BOOKMARK_STORE_KEY = "umcine-bookmark-store";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  addBookmark: (movieId: number) => void;
  removeBookmark: (movieId: number) => void;
  toggleBookmark: (movieId: number) => void;
}

function isMovieIdArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((id) => Number.isInteger(id));
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],

      addBookmark: (movieId) =>
        set((state) =>
          state.bookmarkedMovieIds.includes(movieId)
            ? state
            : { bookmarkedMovieIds: [...state.bookmarkedMovieIds, movieId] },
        ),

      removeBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.filter((id) => id !== movieId),
        })),

      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: BOOKMARK_STORE_KEY,
      // localStorage는 새로고침은 물론 브라우저를 껐다 켜도 값이 남아요.
      storage: createJSONStorage(() => localStorage),
      // 액션 함수는 빼고 북마크 ID 배열만 저장해요.
      partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
      // 저장값이 손상됐거나 형식이 다르면 초기 빈 상태를 그대로 써요.
      merge: (persistedState, currentState) => {
        const ids = (persistedState as Partial<BookmarkStore> | undefined)?.bookmarkedMovieIds;
        return isMovieIdArray(ids) ? { ...currentState, bookmarkedMovieIds: ids } : currentState;
      },
    },
  ),
);