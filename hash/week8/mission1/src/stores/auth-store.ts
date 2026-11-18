import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  sessionId: number;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionId: 0,
      setAccessToken: (accessToken) =>
        set((state) => ({ accessToken, sessionId: state.sessionId + 1 })),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);
