import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "../../../lib/query-client";
import { getServerMovie } from "../../../lib/server/tmdb";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
import { MovieDetailState } from "../../../components/movies/movie-detail-state";

export const metadata: Metadata = { title: "영화 상세", description: "영화 정보와 즐겨찾기, 나의 평점을 확인해 보세요." };

interface PageProps { params: Promise<{ movieId: string }> }

export default function Page({ params }: PageProps) {
  return <Suspense fallback={<MovieDetailState loading message="영화 상세 정보를 불러오는 중..." />}>
    <MovieContent params={params} />
  </Suspense>;
}

async function MovieContent({ params }: PageProps) {
  const { movieId } = await params;
  const id = Number(movieId);
  const queryClient = makeQueryClient();
  if (/^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0) {
    // 실패하면 빈 캐시를 전달하고 기존 클라이언트 화면에서 재시도하게 한다.
    await queryClient.prefetchQuery({
      queryKey: ["movies", "detail", id],
      queryFn: () => getServerMovie(id),
      staleTime: 30_000,
    });
  }
  return <HydrationBoundary state={dehydrate(queryClient)}><MovieDetailPage /></HydrationBoundary>;
}
