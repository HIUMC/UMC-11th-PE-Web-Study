import { Suspense } from "react";
import { MovieListPage } from "../screens/movies/movie-list-page";
import { RequestState } from "../components/movies/request-state";

export default function HomePage() {
  return <Suspense fallback={<main className="flex-1"><RequestState loading message="영화 목록을 준비하는 중..." /></main>}>
    <MovieListPage />
  </Suspense>;
}
