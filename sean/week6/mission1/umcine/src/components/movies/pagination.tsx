interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:cursor-default disabled:opacity-40"
      >
        이전
      </button>
      <span className="px-3 text-sm text-neutral-600">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:cursor-default disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}