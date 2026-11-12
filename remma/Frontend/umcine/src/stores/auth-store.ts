import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const AUTH_STORE_KEY = "umcine-auth-store";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: AUTH_STORE_KEY,
      // 새로고침해도 로그인 상태가 유지되도록 localStorage에 저장해요.
      storage: createJSONStorage(() => localStorage),
      // 액션 함수는 빼고 토큰만 저장해요.
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 저장값이 손상됐거나 형식이 다르면 로그아웃 상태로 시작해요.
      merge: (persistedState, currentState) => {
        const token = (persistedState as Partial<AuthStore> | undefined)?.accessToken;
        return typeof token === "string" && token.length > 0
          ? { ...currentState, accessToken: token }
          : currentState;
      },
    },
  ),
);

/** 컴포넌트 밖(라우터 beforeLoad, ky hook 등)에서 로그인 여부를 확인할 때 사용해요. */
export function isAuthenticated() {
  return useAuthStore.getState().accessToken !== null;
}
