import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPage } from "../../screens/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색 | UMCINE",
};

export default function SearchRoutePage() {
  return (
    <Suspense
      fallback={<main className="p-8">검색 화면을 불러오는 중이에요.</main>}
    >
      <SearchPage />
    </Suspense>
  );
}
