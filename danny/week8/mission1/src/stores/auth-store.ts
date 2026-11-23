import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { queryClient } from "../api/query-client";
import { getMemberIdFromToken, isTokenExpired } from "../utils/jwt";

interface AuthState {
  accessToken: string | null;
  logIn: (accessToken: string) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      logIn: (accessToken) => set({ accessToken }),
      logOut: () => {
        set({ accessToken: null });
        queryClient.removeQueries({ queryKey: ["members", "me"] });
        queryClient.removeQueries({ queryKey: ["favorites"] });
        queryClient.removeQueries({ queryKey: ["ratings"] });
      },
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      merge: (persistedState, currentState) => {
        const token = (persistedState as { accessToken?: unknown } | undefined)
          ?.accessToken;
        return {
          ...currentState,
          accessToken:
            typeof token === "string" && !isTokenExpired(token) ? token : null,
        };
      },
    },
  ),
);

export function getValidAccessToken() {
  const { accessToken } = useAuthStore.getState();
  return accessToken && !isTokenExpired(accessToken) ? accessToken : null;
}

export function useMemberId() {
  return useAuthStore((state) =>
    state.accessToken ? getMemberIdFromToken(state.accessToken) : null,
  );
}

export function useIsLoggedIn() {
  return useAuthStore((state) => state.accessToken !== null);
}
