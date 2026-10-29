function Header()
{
    return (
        <header className="z-0 flex w-full items-center justify-between gap-4 border-b border-border-default bg-bg-surface px-4 py-4 sm:px-6 lg:px-10 xl:px-20">
            <div className="flex min-w-0 items-center gap-6">
                <div className="flex shrink-0 items-center gap-2.5">
                    <span className="flex size-8 flex-col items-center justify-center rounded-lg border-2 border-text-primary py-1.5">
                        <img className="size-6" src="/icons/movie.svg" alt="UMCine Logo" />
                    </span>
                    <span className="flex items-center text-xl leading-6 font-black tracking-tight text-text-primary [font-family:Pretendard]">
                        UMCine
                    </span>
                </div>

                <div className="hidden items-center gap-6 md:flex">
                    <span className="text-sm font-bold text-text-primary underline [font-family:Pretendard]">영화</span>
                    <span className="text-sm font-bold text-text-secondary [font-family:Pretendard]">검색</span>
                    <span className="text-sm font-bold text-text-secondary [font-family:Pretendard]">내 정보</span>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
                <button className="flex size-10 items-center justify-center rounded-lg border border-border-default bg-bg-surface px-1.5 py-px">
                    <img className="size-6" src="/icons/search.svg" alt="Search" />
                </button>
                <button className="flex h-10 items-center justify-center rounded-lg border border-bg-surface bg-action-primary px-4 text-center text-sm leading-[17px] font-extrabold text-bg-surface [font-family:Pretendard]">
                    로그인
                </button>
            </div>
        </header>
    );
}

export default Header;