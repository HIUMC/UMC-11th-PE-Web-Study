import { Suspense } from "react";
import { SearchPage } from "@/pages/movies/search-page";

export default function Page() {
  return (
    <Suspense fallback={<p className="py-16 text-center">검색 페이지 로딩 중...</p>}>
      <SearchPage />
    </Suspense>
  );
}