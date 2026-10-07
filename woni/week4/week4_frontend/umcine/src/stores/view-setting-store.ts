import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SortOrder = "default" | "title";

interface ViewSettingStore {
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
}

export const useViewSettingStore = create<ViewSettingStore>()(
  persist(
    (set) => ({
      sortOrder: "default",
      setSortOrder: (sortOrder) => set({ sortOrder }),
    }),
    {
      name: "umcine-view-setting-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sortOrder: state.sortOrder,
      }),
    },
  ),
);
