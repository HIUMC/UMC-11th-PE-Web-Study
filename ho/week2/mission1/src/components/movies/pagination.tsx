import { cn } from "../../utils/cn";

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 disabled:cursor-default disabled:text-slate-300"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span
          className="size-5 bg-current [mask:var(--icon)_center/contain_no-repeat] [-webkit-mask:var(--icon)_center/contain_no-repeat]"
          style={{ "--icon": "url(/icons/chevron-left.svg)" } as React.CSSProperties}
        />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-slate-500",
            page === currentPage && "bg-slate-950 text-white",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 disabled:cursor-default disabled:text-slate-300"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span
          className="size-5 bg-current [mask:var(--icon)_center/contain_no-repeat] [-webkit-mask:var(--icon)_center/contain_no-repeat]"
          style={{ "--icon": "url(/icons/chevron-right.svg)" } as React.CSSProperties}
        />
      </button>
    </nav>
  );
}
