import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];

  // 화살표 버튼과 숫자 버튼의 공통 스타일
  const baseButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e8f0] bg-transparent text-[0.85rem] font-medium text-[#475569] transition-all duration-200";

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="페이지 이동">
      <button
        type="button"
        className={cn(
          baseButtonClass,
          "disabled:cursor-not-allowed disabled:opacity-[0.35]"
        )}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="이전" className="h-4 w-4" />
      </button>

      <div className="flex gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              baseButtonClass,
              currentPage === page
                ? "border-[#3b82f6] bg-[#3b82f6] text-[#F6F7F9]"
                : "hover:bg-[#F6F7F9]"
            )}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={cn(
          baseButtonClass,
          "disabled:cursor-not-allowed disabled:opacity-[0.35]"
        )}
        disabled={currentPage === 5}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="다음" className="h-4 w-4" />
      </button>
    </nav>
  );
}