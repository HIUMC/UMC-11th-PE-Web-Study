const Header = () => {
  return (
    <header className="flex h-[64px] w-full items-center justify-between border-b border-gray-100 bg-white px-5">
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-[18px] font-bold text-gray-900">
            UMCine
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-[14px]">
          <button
            type="button"
            className="font-semibold text-gray-900 underline underline-offset-4"
          >
            영화
          </button>

          <button
            type="button"
            className="font-medium text-gray-500 hover:text-gray-900"
          >
            검색
          </button>

          <button
            type="button"
            className="font-medium text-gray-500 hover:text-gray-900"
          >
            내 정보
          </button>
        </nav>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
        >
          <img src="/icons/movie-icons/movie-icons/search.svg" alt="" className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          className="h-9 rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
};

export default Header;
