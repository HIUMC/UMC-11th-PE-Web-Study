import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

const subscribe = (onChange: () => void) =>
  useAuthStore.persist.onFinishHydration(onChange);

export function useAuthHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
