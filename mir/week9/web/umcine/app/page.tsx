import { Suspense } from "react";
import { MovieListPage } from "../screens/movies/movie-list-page";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center py-20 text-sm text-[#606774]">
          영화 목록을 불러오는 중이에요.
        </main>
      }
    >
      <MovieListPage />
    </Suspense>
  );
}
