import { createJSONStorage, type StateStorage } from "zustand/middleware";

const browserStorage: StateStorage = {
  getItem: (name) => {
    try {
      return typeof window !== "undefined" ? window.localStorage.getItem(name) : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(name, value);
    } catch {
      // 저장소 접근이 제한돼도 현재 탭의 상태는 유지된다.
    }
  },
  removeItem: (name) => {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(name);
    } catch {
      // 저장소를 쓸 수 없는 환경에서는 제거할 내용이 없다.
    }
  },
};

export const createPersistStorage = <T>() => createJSONStorage<T>(() => browserStorage);
