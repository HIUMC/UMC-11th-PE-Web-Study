import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages < 1) return null;
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  const arrowClass = "flex h-8 w-8 items-center justify-center rounded text-gray-500 disabled:opacity-25";
  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="영화 목록 페이지 이동">
      <button type="button" aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className={arrowClass}>
        <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4" />
      </button>
      {pages.map((page) => (
        <button key={page} type="button" aria-label={`${page}페이지`} aria-current={page === currentPage ? "page" : undefined} onClick={() => onPageChange(page)} className={cn("h-8 w-8 rounded-md text-xs font-semibold transition-colors", page === currentPage ? "bg-[#17191e] text-white" : "text-gray-500 hover:bg-gray-200")}>
          {page}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className={arrowClass}>
        <img src="/icons/chevron-right.svg" alt="" className="h-4 w-4" />
      </button>
    </nav>
  );
}
