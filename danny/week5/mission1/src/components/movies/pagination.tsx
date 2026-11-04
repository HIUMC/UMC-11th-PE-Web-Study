import { cn } from "../../utils/cn";

const VISIBLE_PAGE_COUNT = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - VISIBLE_PAGE_COUNT + 1),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGE_COUNT - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="페이지네이션"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border disabled:opacity-40"
      >
        <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4" />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium text-ink-muted",
            page === currentPage && "bg-ink text-surface",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border disabled:opacity-40"
      >
        <img src="/icons/chevron-right.svg" alt="" className="h-4 w-4" />
      </button>
    </nav>
  );
}
