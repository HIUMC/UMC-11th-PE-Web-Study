"use client";

import Link from "next/link";
import { RequestState } from "../components/movies/request-state";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex-1 px-5 py-14">
    <RequestState message="페이지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." onRetry={reset} />
    <Link href="/" className="mt-6 block text-center font-bold text-blue-600">영화 목록으로 돌아가기</Link>
  </main>;
}
