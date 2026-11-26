import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <p className="text-gray-600">페이지를 찾을 수 없어요.</p>
      <Link href="/" className="rounded-md bg-black px-4 py-2 text-sm text-white">
        영화 목록으로
      </Link>
    </main>
  );
}
