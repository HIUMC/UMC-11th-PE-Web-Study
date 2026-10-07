import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BrowserStorage } from '../utils/bookmark-storage.ts'
import { createSafePersistStorage, isRecord, type StorageReporter } from '../utils/safe-persist-storage.ts'

export const DISPLAY_SETTINGS_KEY = 'umcine-display-settings'
export type CardSize = 'standard' | 'compact'
export function normalizeDisplaySettings(state: unknown): { cardSize: CardSize } {
  return { cardSize: isRecord(state) && state.cardSize === 'compact' ? 'compact' : 'standard' }
}

interface DisplaySettings { cardSize: CardSize; setCardSize: (value: CardSize) => void }
export function createDisplaySettingsStore(storage?: BrowserStorage, report?: StorageReporter) {
  return create<DisplaySettings>()(persist((set) => ({
    cardSize: 'standard',
    setCardSize: value => { if (value === 'standard' || value === 'compact') set({ cardSize: value }) },
  }), {
    name: DISPLAY_SETTINGS_KEY,
    storage: createJSONStorage(() => createSafePersistStorage(() => storage ?? localStorage, normalizeDisplaySettings, report)),
    partialize: state => ({ cardSize: state.cardSize }),
    merge: (persisted, current) => ({ ...current, ...normalizeDisplaySettings(persisted) }),
    skipHydration: !storage && typeof window === 'undefined',
  }))
}

export const useDisplaySettingsStore = createDisplaySettingsStore()
