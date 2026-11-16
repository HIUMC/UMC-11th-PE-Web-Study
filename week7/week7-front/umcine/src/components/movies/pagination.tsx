interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VISIBLE_PAGE_COUNT = 5;

// 현재 페이지가 가운데 오도록 페이지 번호 5개를 만들어요.
function getPageNumbers(currentPage: number, totalPages: number) {
  const count = Math.min(VISIBLE_PAGE_COUNT, totalPages);
  const start = Math.max(1, Math.min(currentPage - Math.floor(count / 2), totalPages - count + 1));
  return Array.from({ length: count }, (_, index) => start + index);
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const goToPreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <nav className="pagination" aria-label="영화 목록 페이지 이동">
      <button
        className="pagination-arrow"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={goToPreviousPage}
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`page-number${currentPage === pageNumber ? " selected" : ""}`}
          type="button"
          aria-current={currentPage === pageNumber ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="pagination-arrow"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={goToNextPage}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;
