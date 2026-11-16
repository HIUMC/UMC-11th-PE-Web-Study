import { Link } from "@tanstack/react-router";

export function MyInfoPage() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] flex-col text-[#191B20]">
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pt-6 pb-16 sm:px-20">
        <div className="flex items-center justify-between border-b border-[#E3E6EB] pb-7">
          <h2 className="text-[28px] font-bold">내 정보</h2>
          <Link
            to="/mypage/edit"
            className="rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section
          className="border-b border-[#E3E6EB] pt-3 pb-3"
          aria-labelledby="basic-info"
        >
          <h3 id="basic-info" className="mb-4 font-bold">
            기본 정보
          </h3>
          <div className="flex items-center gap-7">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#E3E6EB]">
              <img
                src="/icons/person.svg"
                alt="기본 프로필"
                className="size-10"
              />
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <div>
                <div className="mb-1 text-xs text-gray-400">닉네임</div>
                <div className="mb-1 text-xs text-black font-bold">
                  youngyoom
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-400">이메일</div>
                <div className="mb-1 text-xs text-black font-bold">
                  c411090@naver.com
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-6" aria-labelledby="favorites">
          <h3 id="favorites" className="mb-4 font-bold">
            내 즐겨찾기
          </h3>
        </section>
      </main>
      <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E3E6EB] bg-white px-6 py-5 text-xs text-gray-500 sm:px-20">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-6" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a href="https://www.themoviedb.org/" className="underline">
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
