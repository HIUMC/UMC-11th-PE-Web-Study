import "./pagination.css";

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
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination-arrow"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span
          className="icon"
          style={{ "--icon": "url(/icons/chevron-left.svg)" } as React.CSSProperties}
        />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-page${page === currentPage ? " is-active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="pagination-arrow"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span
          className="icon"
          style={{ "--icon": "url(/icons/chevron-right.svg)" } as React.CSSProperties}
        />
      </button>
    </nav>
  );
}
