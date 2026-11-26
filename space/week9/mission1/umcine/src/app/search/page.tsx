import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
export const metadata: Metadata = { title: "영화 검색" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><SearchPage /></Suspense>; }
