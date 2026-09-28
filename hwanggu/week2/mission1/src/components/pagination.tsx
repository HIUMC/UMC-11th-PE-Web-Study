interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChangePage }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button type="button" className="pagination__arrow" onClick={() => onChangePage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="이전 페이지">〈</button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? "pagination__page is-active" : "pagination__page"}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onChangePage(page)}
        >
          {page}
        </button>
      ))}
      <button type="button" className="pagination__arrow" onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="다음 페이지">〉</button>
    </nav>
  );
}
