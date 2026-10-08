import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BOOKMARK_STORAGE_KEY = "umcine-bookmark-store";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// Web Storage 값은 개발자 도구에서 바뀔 수 있어서, 양의 정수 ID만 남겨요.
function sanitizeMovieIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  const validIds = value.filter(
    (movieId): movieId is number =>
      typeof movieId === "number" && Number.isInteger(movieId) && movieId > 0,
  );
  // 같은 ID가 여러 번 들어 있어도 한 번만 남겨요.
  return [...new Set(validIds)];
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
      name: BOOKMARK_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // action은 저장하지 않고 북마크 ID 배열만 저장해요.
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      // 저장값을 store에 합칠 때 잘못된 값은 걸러내요.
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<BookmarkStore> | undefined;
        return {
          ...currentState,
          bookmarkedMovieIds: sanitizeMovieIds(saved?.bookmarkedMovieIds),
        };
      },
    },
  ),
);
