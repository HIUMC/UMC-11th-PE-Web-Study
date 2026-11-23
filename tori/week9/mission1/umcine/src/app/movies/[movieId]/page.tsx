import { MovieDetailPage } from "@/pages/movies/movie-detail-page";

interface PageProps {
  params: Promise<{
    movieId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={movieId} />;
}