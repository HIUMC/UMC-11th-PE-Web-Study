import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MovieSort = "default" | "latest" | "title";

export function isMovieSort(value: unknown): value is MovieSort {
  return value === "default" || value === "latest" || value === "title";
}

interface UiSettingsStore {
  movieSort: MovieSort;
  setMovieSort: (movieSort: MovieSort) => void;
}

export const useUiSettingsStore = create<UiSettingsStore>()(
  persist(
    (set) => ({
      movieSort: "default",
      setMovieSort: (movieSort) => set({ movieSort }),
    }),
    {
      name: "umcine-ui-settings",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        movieSort: state.movieSort,
      }),

      merge: (persistedState, currentState) => {
        if (
          typeof persistedState !== "object" ||
          persistedState === null ||
          !("movieSort" in persistedState) ||
          !isMovieSort(persistedState.movieSort)
        ) {
          return currentState;
        }

        return {
          ...currentState,
          movieSort: persistedState.movieSort,
        };
      },
    },
  ),
);