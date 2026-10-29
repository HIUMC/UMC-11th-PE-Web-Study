import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BrowserStorage } from '../utils/bookmark-storage.ts'
import { createSafePersistStorage, isRecord, type StorageReporter } from '../utils/safe-persist-storage.ts'

export const DISPLAY_SETTINGS_KEY = 'umcine-display-settings'
export type CardSize = 'standard' | 'compact'
export type MovieSort = 'default' | 'release-desc' | 'release-asc' | 'title-asc'
export function isMovieSort(value: unknown): value is MovieSort {
  return value === 'default' || value === 'release-desc' || value === 'release-asc' || value === 'title-asc'
}
export function normalizeDisplaySettings(state: unknown): { cardSize: CardSize; movieSort: MovieSort } {
  return {
    cardSize: isRecord(state) && state.cardSize === 'compact' ? 'compact' : 'standard',
    movieSort: isRecord(state) && isMovieSort(state.movieSort) ? state.movieSort : 'default',
  }
}

interface DisplaySettings {
  cardSize: CardSize
  movieSort: MovieSort
  setCardSize: (value: CardSize) => void
  setMovieSort: (value: MovieSort) => void
}
export function createDisplaySettingsStore(storage?: BrowserStorage, report?: StorageReporter) {
  return create<DisplaySettings>()(persist((set) => ({
    cardSize: 'standard',
    movieSort: 'default',
    setCardSize: value => { if (value === 'standard' || value === 'compact') set({ cardSize: value }) },
    setMovieSort: value => { if (isMovieSort(value)) set({ movieSort: value }) },
  }), {
    name: DISPLAY_SETTINGS_KEY,
    storage: createJSONStorage(() => createSafePersistStorage(() => storage ?? localStorage, normalizeDisplaySettings, report)),
    partialize: state => ({ cardSize: state.cardSize, movieSort: state.movieSort }),
    merge: (persisted, current) => ({ ...current, ...normalizeDisplaySettings(persisted) }),
    skipHydration: !storage && typeof window === 'undefined',
  }))
}

export const useDisplaySettingsStore = createDisplaySettingsStore()
