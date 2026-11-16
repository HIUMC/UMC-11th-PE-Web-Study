import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Profile {
  email: string;
  nickname: string;
  introduction: string;
}

interface ProfileStore {
  profile: Profile;
  updateProfile: (profile: Pick<Profile, "nickname" | "introduction">) => void;
}

// 내 정보 API는 8주차에 연결 예정. 그전까지는 화면 확인용 값을 store에 저장함
const DEFAULT_PROFILE: Profile = {
  email: "umc@example.com",
  nickname: "moviefan",
  introduction: "",
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (nextProfile) =>
        set((state) => ({ profile: { ...state.profile, ...nextProfile } })),
    }),
    {
      name: "umcine-profile-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
