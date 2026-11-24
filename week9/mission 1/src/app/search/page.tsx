import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";
export default function Page() { return <Suspense fallback={<main className="mx-auto flex-1 p-16" role="status">검색 화면을 불러오는 중이에요.</main>}><SearchPage /></Suspense>; }
