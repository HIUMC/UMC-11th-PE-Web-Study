import { create } from "zustand";

export const useAuthStore = create<{ token: string; setToken: (token: string) => void; logout: () => void }>(set => ({
  token: sessionStorage.getItem("umcine-access-token") || "",
  setToken: token => { sessionStorage.setItem("umcine-access-token", token); set({ token }); },
  logout: () => { sessionStorage.removeItem("umcine-access-token"); set({ token: "" }); },
}));
