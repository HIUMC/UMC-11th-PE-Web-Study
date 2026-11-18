import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  sessionExpired: boolean;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: (sessionExpired?: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionExpired: false,
      setAccessToken: (accessToken) => set({ accessToken, sessionExpired: false }),
      clearAccessToken: (sessionExpired = false) => set({ accessToken: null, sessionExpired }),
    }),
    {
      name: "umcine-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
