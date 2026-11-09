import { useState } from "react";
import { cn } from "../../utils/cn";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav
      aria-label="페이지네이션"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border disabled:opacity-40"
      >
        <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4" />
      </button>

      {PAGE_NUMBERS.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => setCurrentPage(page)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-ink-muted",
            page === currentPage && "bg-ink text-surface",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === PAGE_NUMBERS.length}
        onClick={() =>
          setCurrentPage((page) => Math.min(PAGE_NUMBERS.length, page + 1))
        }
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border disabled:opacity-40"
      >
        <img src="/icons/chevron-right.svg" alt="" className="h-4 w-4" />
      </button>
    </nav>
  );
}
