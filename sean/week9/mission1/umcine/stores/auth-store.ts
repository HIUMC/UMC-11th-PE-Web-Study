import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

// 서버에는 localStorage가 없습니다. 서버 렌더링 중에는 아무것도 저장하지 않는
// 빈 저장소를 쓰고, 브라우저에서만 실제 localStorage를 사용합니다.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);

/**
 * localStorage에서 토큰을 읽어오는 작업이 끝났는지 알려줍니다.
 *
 * 첫 렌더링은 서버에서 일어나므로 토큰이 항상 null입니다.
 * 이 값을 기다리지 않고 바로 판단하면, 로그인한 사용자도 잠깐 로그아웃 상태로
 * 보이거나 보호된 페이지에서 튕겨 나갑니다.
 */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
