import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { sanitizeBookmarkIds, type BrowserStorage } from '../utils/bookmark-storage.ts'
import { createSafePersistStorage, isRecord, type StorageReporter } from '../utils/safe-persist-storage.ts'

export const BOOKMARK_STORE_KEY = 'umcine-bookmark-store'
interface BookmarkData { bookmarkedMovieIds: number[] }
interface BookmarkStore extends BookmarkData { toggleBookmark: (movieId: number) => void }
export function normalizeBookmarks(state: unknown): BookmarkData {
  return { bookmarkedMovieIds: sanitizeBookmarkIds(isRecord(state) ? state.bookmarkedMovieIds : undefined) }
}

// 저장소 주입은 테스트용. 실제 앱 인스턴스는 아래 useBookmarkStore 하나다.
export function createBookmarkStore(storage?: BrowserStorage, report?: StorageReporter) {
  const safeStorage = createSafePersistStorage(() => storage ?? localStorage, normalizeBookmarks, report)
  return create<BookmarkStore>()(persist((set) => ({
    bookmarkedMovieIds: [],
    toggleBookmark: (movieId) => {
      if (!Number.isSafeInteger(movieId) || movieId <= 0) return
      set(state => ({ bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
        ? state.bookmarkedMovieIds.filter(id => id !== movieId)
        : [...state.bookmarkedMovieIds, movieId] }))
    },
  }), {
    name: BOOKMARK_STORE_KEY,
    storage: createJSONStorage(() => safeStorage),
    partialize: state => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
    merge: (persisted, current) => ({ ...current, ...normalizeBookmarks(persisted) }),
    skipHydration: !storage && typeof window === 'undefined',
  }))
}

export const useBookmarkStore = createBookmarkStore()
