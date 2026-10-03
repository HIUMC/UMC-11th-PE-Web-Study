import { useState } from "react";
import { cn } from "../../utils/cn";

const pages = [1, 2, 3, 4, 5];

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav
      className="flex h-9 w-full items-center justify-center gap-3"
      aria-label="영화 목록 페이지"
    >
      <button
        type="button"
        className="group flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 disabled:cursor-default"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => page - 1)}
      >
        <img
          src="/icons/movie-icons/chevron-left.svg"
          alt=""
          className="block h-6 w-6 opacity-60 group-disabled:opacity-20"
        />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[7px] border-0 px-1.5 py-px text-[13px] leading-4 font-bold",
              page === currentPage
                ? "bg-[#17191e] text-white"
                : "bg-transparent text-[#606774]",
            )}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="group flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 disabled:cursor-default"
        aria-label="다음 페이지"
        disabled={currentPage === 5}
        onClick={() => setCurrentPage((page) => page + 1)}
      >
        <img
          src="/icons/movie-icons/chevron-right.svg"
          alt=""
          className="block h-6 w-6 opacity-60 group-disabled:opacity-20"
        />
      </button>
    </nav>
  );
}
