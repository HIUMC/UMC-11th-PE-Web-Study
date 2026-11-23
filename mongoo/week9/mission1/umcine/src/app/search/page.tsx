import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="page-container py-24 text-center text-gray-500">
          검색 화면을 준비하는 중이에요.
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}