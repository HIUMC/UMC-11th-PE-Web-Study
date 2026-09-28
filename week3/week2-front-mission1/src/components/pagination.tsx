import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pageNumbers = [1, 2, 3, 4, 5];

function Pagination({ currentPage, onPageChange }: PaginationProps) {
  const goToPreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(pageNumbers.length, currentPage + 1));
  };

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="영화 목록 페이지 이동"
    >
      <button
        className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white/8 text-[15px] font-extrabold text-[#d8dde6] disabled:opacity-38"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={goToPreviousPage}
      >
        <img className="h-5 w-5" src="/icons/chevron-left.svg" alt="" />
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={cn(
            "inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white/8 text-[15px] font-extrabold text-[#d8dde6]",
            currentPage === pageNumber && "bg-[#f04252] text-white",
          )}
          type="button"
          aria-current={currentPage === pageNumber ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white/8 text-[15px] font-extrabold text-[#d8dde6] disabled:opacity-38"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === pageNumbers.length}
        onClick={goToNextPage}
      >
        <img className="h-5 w-5" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;
