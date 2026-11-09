import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VISIBLE_PAGE_COUNT = 5;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재 페이지를 가운데에 두고 최대 5개의 페이지 번호를 보여 줘요.
  const half = Math.floor(VISIBLE_PAGE_COUNT / 2);
  const start = Math.max(
    1,
    Math.min(currentPage - half, totalPages - VISIBLE_PAGE_COUNT + 1),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGE_COUNT - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const arrowClassName =
    "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white disabled:opacity-40";

  return (
    <nav
      aria-label="페이지 이동"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={arrowClassName}
      >
        <img src="/icons/chevron-left.svg" alt="이전 페이지" className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm",
            page === currentPage
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={arrowClassName}
      >
        <img src="/icons/chevron-right.svg" alt="다음 페이지" className="h-4 w-4" />
      </button>
    </nav>
  );
}
