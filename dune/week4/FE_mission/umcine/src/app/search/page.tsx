import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../features/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "제목으로 영화를 검색하고 상세 정보를 확인하세요.",
  openGraph: {
    title: "영화 검색 | UMCine",
    description: "제목으로 영화를 검색하고 상세 정보를 확인하세요.",
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="main">
          <p role="status">검색 화면을 준비하는 중이에요.</p>
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
