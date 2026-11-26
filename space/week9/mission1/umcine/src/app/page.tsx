import type { Metadata } from "next";
import { Suspense } from "react";
import MovieListPage from "../screens/movies/movie-list-page";
export const metadata: Metadata = { title: "영화 목록" };
export default function Page() { return <Suspense fallback={<main className="p-6" role="status">불러오는 중이에요.</main>}><MovieListPage /></Suspense>; }
