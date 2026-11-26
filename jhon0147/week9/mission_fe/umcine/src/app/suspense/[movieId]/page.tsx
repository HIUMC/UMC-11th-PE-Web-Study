import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailSuspensePage } from "../../../screens/movies/movie-detail-suspense-page";
import { MovieDetailState } from "../../../components/movies/movie-detail-state";

export const metadata: Metadata = { title: "영화 상세 · Suspense" };

interface PageProps { params: Promise<{ movieId: string }> }

export default function Page({ params }: PageProps) {
  return <Suspense fallback={<MovieDetailState loading message="영화 상세 정보를 불러오는 중..." />}>
    <MovieContent params={params} />
  </Suspense>;
}

async function MovieContent({ params }: PageProps) {
  await params;
  return <MovieDetailSuspensePage />;
}
