import { create } from "zustand";

interface Profile {
  nickname: string;
  email: string;
  profileImage: string | null;
}

interface ProfileStore {
  profile: Profile;
  updateProfile: (
    values: Pick<Profile, "nickname" | "profileImage">,
  ) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    nickname: "몽구",
    email: "test@example.com",
    profileImage: null,
  },

  updateProfile: (values) => {
    set((state) => ({
      profile: {
        ...state.profile,
        ...values,
      },
    }));
  },
}));