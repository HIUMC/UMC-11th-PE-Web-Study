"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="p-20 text-center"><p>영화 정보를 불러오지 못했어요.</p><button onClick={reset} className="mt-4 rounded bg-gray-900 px-4 py-2 text-white">다시 시도</button></main>}
