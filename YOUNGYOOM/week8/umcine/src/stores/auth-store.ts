//stores/auth-storage
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  //로그인 전에는 null, 로그인 후에는 서버가 준 토큰 저장
  accessToken: string | null;
  memberId: number | null;
  setAccessToken: (accessToken: string | null) => void;

  setMemberId: (memberId: number) => void;
}

export const useAuthStore = create<AuthStore>()(
  //새로고침 해도 저장된 토큰을 복원할 수 있도록 persist 적용
  persist(
    (set) => ({
      accessToken: null,
      memberId: null,
      //로그인 성공 시 토큰 저장, 인증 실패 시 null로 갱신
      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          // 로그아웃하거나 토큰이 바뀌면 이전 회원 ID를 비움
          memberId:
            accessToken && accessToken === state.accessToken
              ? state.memberId
              : null,
        })),

      setMemberId: (memberId) => set({ memberId }),
    }),
    {
      //개발자 도구 내 로컬스토리지에서 확인 가능한 키
      name: "umcine-auth-store",
      //store값을 JSON형태로 local 에 저장
      storage: createJSONStorage(() => localStorage),
      //store 값 중에 accessToken 만 저장
      partialize: (state) => ({
        accessToken: state.accessToken,
        memberId: state.memberId,
      }),
    },
  ),
);
