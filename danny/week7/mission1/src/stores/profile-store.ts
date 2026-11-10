import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileState {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  logIn: (email: string) => void;
  updateProfile: (profile: {
    nickname: string;
    profileImageUrl: string | null;
  }) => void;
  reset: () => void;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      email: "",
      nickname: "",
      profileImageUrl: null,
      logIn: (email) =>
        set((state) => ({
          email,
          nickname: state.nickname || email.split("@")[0],
        })),
      updateProfile: ({ nickname, profileImageUrl }) => {
        const previous = get().profileImageUrl;
        if (previous && previous !== profileImageUrl) {
          URL.revokeObjectURL(previous);
        }
        set({ nickname, profileImageUrl });
      },
      reset: () => {
        const previous = get().profileImageUrl;
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        set({ email: "", nickname: "", profileImageUrl: null });
      },
    }),
    {
      name: "umcine-profile-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ email: state.email, nickname: state.nickname }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as
          | { email?: unknown; nickname?: unknown }
          | undefined;
        return {
          ...currentState,
          email: asString(saved?.email),
          nickname: asString(saved?.nickname),
        };
      },
    },
  ),
);
