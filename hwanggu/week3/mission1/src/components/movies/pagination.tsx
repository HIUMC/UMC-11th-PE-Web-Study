import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const buttonBase =
    "min-w-10 h-10 px-2 rounded-lg border border-[#333] text-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="페이지 이동">
      <button
        type="button"
        className={buttonBase}
        onClick={() => onChangePage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        〈
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onChangePage(page)}
          className={cn(
            buttonBase,
            page === currentPage &&
              "border-[#b2dab1] bg-[#b2dab1] font-bold text-[#141414]",
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className={buttonBase}
        onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        〉
      </button>
    </nav>
  );
}
