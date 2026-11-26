import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
export const metadata: Metadata = { title: "영화 상세" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><MovieDetailPage /></Suspense>; }
