import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export default function MovieDetailRoutePage() {
  return (
    <Suspense
      fallback={<main className="p-8">영화 정보를 불러오는 중이에요.</main>}
    >
      <MovieDetailPage />
    </Suspense>
  );
}
