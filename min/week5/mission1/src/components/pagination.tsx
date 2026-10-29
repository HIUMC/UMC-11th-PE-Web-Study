interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button type="button" aria-label="이전 페이지" disabled={currentPage === 1}>
        <span aria-hidden="true">‹</span>
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
      >
        <span aria-hidden="true">›</span>
      </button>
    </nav>
  );
}
