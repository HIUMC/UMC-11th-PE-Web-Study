import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
import RequestMessage from "../../../components/movies/request-message";
import { readMovieId } from "../../../utils/movies/page-search";

export const metadata = { title: "영화 상세" };

type Props = PageProps<"/movies/[movieId]">;

export default function MovieDetailRoute({ params }: Props) {
  return (
    <Suspense fallback={<main className="flex-1"><RequestMessage message="영화 정보를 준비하고 있어요." /></main>}>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: Pick<Props, "params">) {
  const movieId = readMovieId((await params).movieId);
  if (movieId === undefined) notFound();
  return <MovieDetailPage key={movieId} movieId={movieId} />;
}
