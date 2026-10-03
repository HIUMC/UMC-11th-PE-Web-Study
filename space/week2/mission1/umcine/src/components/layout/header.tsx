function Header()
{
    return (
        <header className="z-0 box-border flex w-full items-center justify-between border-b border-[#e3e6eb] bg-white px-20 py-6">
            <div className="flex h-8 w-[308px] items-center gap-[42px]">
                <div className="flex h-8 w-[116px] items-center gap-[10px]">
                    <span className="box-border flex size-8 flex-col items-center justify-center rounded-lg border-2 border-[#17191e] py-[6px]">
                        <img className="size-6" src="/icons/movie.svg" alt="UMCine Logo" />
                    </span>
                    <span className="flex h-6 w-[74px] items-center text-[20px] leading-6 font-black tracking-[-0.7px] text-[#17191e] [font-family:Pretendard]">
                        UMCine
                    </span>
                </div>

                <div className="flex h-[17px] w-[150px] items-center gap-[30px]">
                    <span className="flex h-[17px] items-center text-center text-[14px] leading-[17px] font-bold text-[#17191e] underline [font-family:Pretendard]">영화</span>
                    <span className="flex h-[17px] items-center text-center text-[14px] leading-[17px] font-bold text-[#606774] [font-family:Pretendard]">검색</span>
                    <span className="flex h-[17px] items-center text-center text-[14px] leading-[17px] font-bold text-[#606774] [font-family:Pretendard]">내 정보</span>
                </div>
            </div>

            <div className="flex h-[42px] w-[123px] items-center gap-[10px]">
                <button className="box-border flex size-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white px-[6px] py-px">
                    <img className="size-6" src="/icons/search.svg" alt="Search" />
                </button>
                <button className="box-border flex h-[42px] w-[71px] items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-center text-[14px] leading-[17px] font-extrabold text-white [font-family:Pretendard]">
                    로그인
                </button>
            </div>
        </header>
    );
}

export default Header;