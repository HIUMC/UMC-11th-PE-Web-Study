import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const buttonClass =
    "grid size-9 cursor-pointer place-items-center rounded-lg text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200";

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-1.5"
      aria-label="영화 목록 페이지"
    >
      <button
        className={buttonClass}
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-5 opacity-70" src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          className={cn(
            buttonClass,
            currentPage === page && "bg-blue-600 text-white hover:bg-blue-600",
          )}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={buttonClass}
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-5 opacity-70" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
