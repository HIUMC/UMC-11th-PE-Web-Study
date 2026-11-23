import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/auth-store";

// localStorage에서 토큰 복원이 끝났는지 알려준다.
// 서버에서는 항상 false라서, 복원 전에 "로그인 안 됨"으로 잘못 판단하는 것을 막을 수 있다.
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
