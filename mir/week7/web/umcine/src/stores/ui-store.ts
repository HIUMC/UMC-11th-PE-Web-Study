import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CardSize = "sm" | "md" | "lg";

interface UIStore {
  cardSize: CardSize;
  setCardSize: (size: CardSize) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      cardSize: "md",
      setCardSize: (size) => set({ cardSize: size }),
    }),
    {
      name: "umcine-ui-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
