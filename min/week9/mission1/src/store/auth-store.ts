"use client";
import { create } from "zustand";
export const useAuthStore = create<{ token: string; hydrated: boolean; hydrate: () => void; setToken: (token: string) => void; logout: () => void }>(set => ({
 token: "", hydrated: false,
 hydrate: () => { let token = ""; try { token = sessionStorage.getItem("umcine-access-token") || ""; } catch {} set({token, hydrated:true}); },
 setToken: token => { try { sessionStorage.setItem("umcine-access-token", token); } catch {} set({token}); },
 logout: () => { try { sessionStorage.removeItem("umcine-access-token"); } catch {} set({token:""}); },
}));
