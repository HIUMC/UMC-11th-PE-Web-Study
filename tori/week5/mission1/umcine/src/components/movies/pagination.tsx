import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="페이지 이동">
      <button
        type="button"
        className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface"
        aria-label="이전 페이지"
      >
        <img className="h-5 w-5" src="/icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold",
            page === currentPage && "border-primary bg-primary text-white",
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface"
        aria-label="다음 페이지"
      >
        <img className="h-5 w-5" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}