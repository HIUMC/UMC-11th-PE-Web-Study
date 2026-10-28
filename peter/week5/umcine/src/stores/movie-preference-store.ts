import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type MovieSortOption = "default" | "title";

interface MoviePreferenceStore {
  sortOption: MovieSortOption;
  setSortOption: (sortOption: MovieSortOption) => void;
}

export const useMoviePreferenceStore =
  create<MoviePreferenceStore>()(
    persist(
      (set) => ({
        sortOption: "default",

        setSortOption: (sortOption) => {
          set({ sortOption });
        },
      }),
      {
        name: "umcine-movie-preferences",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );