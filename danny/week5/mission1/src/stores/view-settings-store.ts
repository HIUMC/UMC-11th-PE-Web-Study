import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MovieSort = "default" | "latest" | "title";

const MOVIE_SORTS: readonly unknown[] = ["default", "latest", "title"];

interface ViewSettingsState {
  movieSort: MovieSort;
  setMovieSort: (movieSort: MovieSort) => void;
}

function isMovieSort(value: unknown): value is MovieSort {
  return MOVIE_SORTS.includes(value);
}

export const useViewSettingsStore = create<ViewSettingsState>()(
  persist(
    (set) => ({
      movieSort: "default",
      setMovieSort: (movieSort) => set({ movieSort }),
    }),
    {
      name: "umcine-view-settings-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ movieSort: state.movieSort }),
      merge: (persistedState, currentState) => {
        const movieSort = (
          persistedState as { movieSort?: unknown } | undefined
        )?.movieSort;

        return {
          ...currentState,
          movieSort: isMovieSort(movieSort) ? movieSort : "default",
        };
      },
    },
  ),
);
