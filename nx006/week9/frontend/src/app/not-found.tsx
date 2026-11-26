import Link from 'next/link'

export default function NotFound() {
  return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 md:px-8 xl:px-20">
    <h1 className="text-3xl font-bold">페이지를 찾을 수 없어요.</h1>
    <Link className="mt-4 inline-block text-[#2563eb]" href="/">영화 목록으로 돌아가기</Link>
  </main>
}
