import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex h-[91px] items-center border-b border-[#E3E6EB] bg-white px-5 md:px-[80px]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img
              src="/icons/movie.svg"
              alt="UMCINE 로고"
              className="h-8 w-8 rounded-lg border-2 border-[#17191E] p-0.5"
            />
            <span className="text-xl font-black tracking-[-0.7px] text-[#17191E]">
              UMCINE
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-bold text-[#606774] transition-all duration-150 ease-in-out hover:text-[#17191E] hover:underline"
              activeProps={{ className: "text-[#17191E] underline" }}
              activeOptions={{ exact: true }}
            >
              영화
            </Link>
            <Link
              to="/search"
              className="text-sm font-bold text-[#606774] transition-all duration-150 ease-in-out hover:text-[#17191E] hover:underline"
              activeProps={{ className: "text-[#17191E] underline" }}
            >
              검색
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/search"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#E3E6EB] bg-white transition-colors duration-200 hover:bg-[#F6F7F9]"
            aria-label="검색 페이지로 이동"
          >
            <img src="/icons/search.svg" alt="검색 아이콘" className="h-6 w-6" />
          </Link>
          <button
            type="button"
            className="flex h-[42px] w-[71px] items-center justify-center rounded-lg bg-[#2563EB] text-sm font-extrabold text-white transition-colors duration-200 hover:bg-[#1d4ed8]"
          >
            로그인
          </button>
        </div>

      </div>
    </header>
  );
}