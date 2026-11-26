import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  hasHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
  finishHydration: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      finishHydration: () => set({ hasHydrated: true }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => typeof window === "undefined" ? null : window.localStorage.getItem(name),
        setItem: (name, value) => { if (typeof window !== "undefined") window.localStorage.setItem(name, value); },
        removeItem: (name) => { if (typeof window !== "undefined") window.localStorage.removeItem(name); },
      })),
      skipHydration: true,
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
