import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export default function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  return (
    <Suspense>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={movieId} />;
}
