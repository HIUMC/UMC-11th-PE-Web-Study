import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailPage } from "@/views/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export default function Page({ params }: MovieDetailRouteProps) {
  return (
    <Suspense fallback={<main className="px-20 py-10">영화 정보를 불러오는 중이에요.</main>}>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

// 요청을 받아야 알 수 있는 params는 Suspense 안에서 읽는다
async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
