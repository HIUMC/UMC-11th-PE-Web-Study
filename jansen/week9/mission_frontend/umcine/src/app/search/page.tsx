import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

export default function Page() {
  // SearchPage가 useSearchParams로 URL의 검색어를 읽으므로 Suspense로 감싼다
  return (
    <Suspense fallback={<main className="px-20 py-10">검색 화면을 불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
