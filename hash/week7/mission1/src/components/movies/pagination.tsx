import { cn } from "../../utils/cn";
import { MAX_MOVIE_PAGE } from "../../utils/movies/page-search";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.min(totalPages, MAX_MOVIE_PAGE);
  if (lastPage <= 1) return null;

  const startPage = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  const pages = Array.from(
    { length: Math.min(5, lastPage) },
    (_, index) => startPage + index,
  );
  const buttonClass = "grid h-9 min-w-9 cursor-pointer place-items-center rounded-lg border px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="영화 페이지" className="mt-9 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(buttonClass, "border-[#dce2ee] bg-white text-[#606a7a]")}
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            buttonClass,
            currentPage === page
              ? "border-[#4765df] bg-[#4765df] font-bold text-white"
              : "border-[#dce2ee] bg-white text-[#606a7a] hover:border-[#4765df]",
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(buttonClass, "border-[#dce2ee] bg-white text-[#606a7a]")}
      >
        다음
      </button>
    </nav>
  );
}
