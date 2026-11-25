import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createBrowserStorage } from "./browser-storage";

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
        storage: createBrowserStorage(),
        skipHydration: true,
      },
    ),
  );
