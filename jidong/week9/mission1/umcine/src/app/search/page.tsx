import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "보고 싶은 영화를 제목으로 찾아봐요.",
};

export default function Page() {
  return (
    <Suspense
      fallback={<p className="p-16 text-center text-sm text-gray-500">검색 화면을 불러오는 중이에요.</p>}
    >
      <SearchPage />
    </Suspense>
  );
}
