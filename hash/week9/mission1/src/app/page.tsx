import { Suspense } from "react";
import { MovieListPage } from "../screens/movies/movie-list-page";
import RequestMessage from "../components/movies/request-message";
import { readMoviePage } from "../utils/movies/page-search";

type Props = PageProps<"/">;

export default function HomePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<main className="flex-1"><RequestMessage message="영화 목록을 준비하고 있어요." /></main>}>
      <MovieListRoute searchParams={searchParams} />
    </Suspense>
  );
}

async function MovieListRoute({ searchParams }: Pick<Props, "searchParams">) {
  const { page } = await searchParams;
  return <MovieListPage page={readMoviePage(page) ?? 1} />;
}
