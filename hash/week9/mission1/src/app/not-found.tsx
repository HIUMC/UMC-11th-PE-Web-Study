import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-6 py-20 text-center">
      <h1 className="mb-6 text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="font-semibold text-[#4765df] hover:underline">영화 목록으로 돌아가기</Link>
    </main>
  );
}
