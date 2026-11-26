"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="p-6" role="alert"><h1>페이지를 불러오지 못했어요.</h1><button onClick={reset}>다시 시도</button></main>;
}
