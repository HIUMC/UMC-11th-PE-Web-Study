import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="page-container py-24 text-center text-gray-500">
          영화 페이지를 준비하는 중이에요.
        </main>
      }
    >
      <MovieDetailPage />
    </Suspense>
  );
}