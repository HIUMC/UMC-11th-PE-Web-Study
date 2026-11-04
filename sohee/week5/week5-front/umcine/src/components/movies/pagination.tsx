interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pageNumbers = [1, 2, 3, 4, 5];

function Pagination({ currentPage, onPageChange }: PaginationProps) {
  const goToPreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    onPageChange(Math.min(pageNumbers.length, currentPage + 1));
  };

  return (
    <nav className="pagination" aria-label="영화 목록 페이지 이동">
      <button
        className="pagination-arrow"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
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
        disabled={currentPage === pageNumbers.length}
        onClick={goToNextPage}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;
