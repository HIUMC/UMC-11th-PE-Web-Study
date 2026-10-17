import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const arrowClassName = "flex bg-transparent p-0 disabled:cursor-default disabled:opacity-30";

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button
        type="button"
        className={arrowClassName}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>

      <ol className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={cn(
                  "size-9 rounded-[7px] p-0 text-[13px] font-bold",
                  isActive ? "bg-ink text-surface" : "bg-transparent text-ink-secondary",
                )}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className={arrowClassName}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  );
}
