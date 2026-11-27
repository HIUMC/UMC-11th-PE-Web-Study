import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export const metadata: Metadata = {
  title: "영화 상세",
  description: "영화 정보를 보고 평점과 즐겨찾기를 남겨요.",
};

export default function Page() {
  return (
    <Suspense
      fallback={<p className="p-16 text-center text-gray-500">영화 정보를 불러오는 중이에요.</p>}
    >
      <MovieDetailPage />
    </Suspense>
  );
}
