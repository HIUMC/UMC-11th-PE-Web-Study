import { create } from "zustand";

// 내 정보 화면 확인용 상태. 새로고침하면 예시 값으로 초기화
export const useProfileStore = create<{
  nickname: string;
  email: string;
  updateNickname: (nickname: string) => void;
}>((set) => ({
  nickname: "영화좋아",
  email: "movie@example.com",
  updateNickname: nickname => set({ nickname }),
}));
