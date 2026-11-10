import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonBase =
  "flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-40";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <nav
      aria-label="페이지 이동"
      className="flex items-center justify-center gap-2 px-8 pb-8 pt-4"
    >
      <button
        type="button"
        className={buttonBase}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" className="size-3.5" />
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page} 페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            buttonBase,
            page === currentPage &&
              "border-blue-600 bg-blue-600 font-bold text-white",
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className={buttonBase}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" className="size-3.5" />
      </button>
    </nav>
  );
}
