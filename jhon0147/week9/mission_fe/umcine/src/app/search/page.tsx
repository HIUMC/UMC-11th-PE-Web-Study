import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
import { RequestState } from "../../components/movies/request-state";

export const metadata: Metadata = { title: "영화 검색", description: "제목으로 영화를 검색해 보세요." };

export default function Page() {
  return <Suspense fallback={<main className="flex-1"><RequestState loading message="검색 화면을 준비하는 중..." /></main>}>
    <SearchPage />
  </Suspense>;
}
