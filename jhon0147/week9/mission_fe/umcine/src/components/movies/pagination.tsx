import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [...new Set([1, ...Array.from({ length: end - start + 1 }, (_, index) => start + index), totalPages])]
    .sort((a, b) => a - b);
  const buttonClass = "grid size-9 cursor-pointer place-items-center rounded-lg text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent focus-visible:ring-3 focus-visible:ring-blue-200";
  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="영화 목록 페이지">
      <button className={buttonClass} type="button" aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <img className="size-5 opacity-70" src="/icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((page, index) => (
        <span className="flex items-center gap-1.5" key={page}>
          {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-slate-400" aria-hidden="true">…</span>}
          <button className={cn(buttonClass, currentPage === page && "bg-blue-600 text-white hover:bg-blue-600")}
            type="button" aria-label={`${page}페이지`} aria-current={currentPage === page ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</button>
        </span>
      ))}
      <button className={buttonClass} type="button" aria-label="다음 페이지" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <img className="size-5 opacity-70" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
