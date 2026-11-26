import type { Metadata } from "next";
import { MovieListPage } from "../screens/movies/movie-list-page";

export const metadata: Metadata = {
  title: { absolute: "영화 목록 | UMCine" },
  description: "지금 인기 있는 영화를 둘러봐요.",
};

export default function Page() {
  return <MovieListPage />;
}
