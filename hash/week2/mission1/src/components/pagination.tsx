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
    <div className="pagination" role="group" aria-label="페이지 번호 선택 실습">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__button ${
            currentPage === page ? "pagination__button--active" : ""
          }`}
          aria-pressed={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}