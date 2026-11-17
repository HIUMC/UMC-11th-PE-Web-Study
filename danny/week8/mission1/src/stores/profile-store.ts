import { create } from "zustand";

interface ProfileState {
  profileImageUrl: string | null;
  setProfileImageUrl: (profileImageUrl: string | null) => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profileImageUrl: null,
  setProfileImageUrl: (profileImageUrl) => {
    const previous = get().profileImageUrl;
    if (previous && previous !== profileImageUrl) {
      URL.revokeObjectURL(previous);
    }
    set({ profileImageUrl });
  },
}));
