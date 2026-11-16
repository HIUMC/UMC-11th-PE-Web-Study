import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Profile {
  email: string;
  nickname: string;
}

interface ProfileStore {
  profile: Profile;
  updateNickname: (nickname: string) => void;
}

// 퍼블리싱 미리보기 데이터입니다. 실제 회원 정보 API 연결 시 대체합니다.
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: { email: "name@example.com", nickname: "영화좋아" },
      updateNickname: (nickname) =>
        set((state) => ({ profile: { ...state.profile, nickname } })),
    }),
    {
      name: "umcine-profile-preview",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
