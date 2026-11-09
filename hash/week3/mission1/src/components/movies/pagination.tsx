import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pages = [1, 2, 3, 4, 5];

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div
      role="group"
      aria-label="페이지 번호 선택 실습"
      className="mt-9 flex justify-center gap-2"
    >
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-pressed={currentPage === page}
          onClick={() => onPageChange(page)}
          className={cn(
            "grid h-9 w-9 cursor-pointer place-items-center rounded-lg border text-xs transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]",
            currentPage === page
              ? "border-[#4765df] bg-[#4765df] font-bold text-white"
              : "border-[#dce2ee] bg-white text-[#606a7a] hover:border-[#4765df]",
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
}