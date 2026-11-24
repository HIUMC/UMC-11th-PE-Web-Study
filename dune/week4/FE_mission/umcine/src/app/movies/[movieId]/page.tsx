import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailPage } from "../../../features/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

interface PageProps {
  params: Promise<{ movieId: string }>;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="main">
          <div className="page-content">
            <p role="status">영화 정보를 불러오는 중이에요.</p>
          </div>
        </main>
      }
    >
      <MovieDetailRoute params={params} />
    </Suspense>
  );
}

async function MovieDetailRoute({ params }: PageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={Number(movieId)} />;
}
