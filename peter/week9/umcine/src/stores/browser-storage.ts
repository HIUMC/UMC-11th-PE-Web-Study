import { createJSONStorage } from "zustand/middleware";

export function createBrowserStorage<T>() {
  return createJSONStorage<T>(() => ({
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  }));
}
