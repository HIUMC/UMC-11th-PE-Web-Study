import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserProfile {
  email: string;
  nickname: string;
}

interface AuthStore {
  user: UserProfile | null;
  login: (email: string) => void;
  updateNickname: (nickname: string) => void;
  logout: () => void;
  withdraw: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (email) => set({ user: { email, nickname: "영화팬" } }),
      updateNickname: (nickname) =>
        set((state) =>
          state.user ? { user: { ...state.user, nickname } } : state,
        ),
      logout: () => set({ user: null }),
      withdraw: () => set({ user: null }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
