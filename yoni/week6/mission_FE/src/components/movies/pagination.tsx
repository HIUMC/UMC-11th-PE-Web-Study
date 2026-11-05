import { cn } from "../../utils/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => startPage + index,
  );
  const buttonClass = "flex h-10 min-w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  return (
    <nav aria-label="영화 목록 페이지" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(buttonClass, "text-xl text-blue-600 hover:bg-blue-50 disabled:cursor-default disabled:text-gray-300 disabled:hover:bg-transparent")}
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(buttonClass, page === currentPage
            ? "bg-[#1f2329] text-white"
            : "cursor-pointer text-gray-600 hover:bg-blue-50 hover:text-blue-600")}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(buttonClass, "text-xl text-blue-600 hover:bg-blue-50 disabled:cursor-default disabled:text-gray-300 disabled:hover:bg-transparent")}
      >
        ›
      </button>
    </nav>
  );
}
