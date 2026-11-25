"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

function subscribe(onStoreChange: () => void) {
  // 복원이 끝나면 다시 그리도록 알림
  return useAuthStore.persist.onFinishHydration(onStoreChange);
}

function getSnapshot() {
  return useAuthStore.persist.hasHydrated();
}

function getServerSnapshot() {
  // 서버에서는 localStorage를 읽을 수 없으므로 항상 복원 전 상태
  return false;
}

// 로그인 스토어가 localStorage에서 복원을 마쳤는지 여부
export function useAuthStoreHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
