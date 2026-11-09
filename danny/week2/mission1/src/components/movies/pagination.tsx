import { useState } from "react";
import "./pagination.css";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav aria-label="페이지네이션" className="pagination">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        className="pagination__arrow-button"
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {PAGE_NUMBERS.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => setCurrentPage(page)}
          className={
            page === currentPage
              ? "pagination__page-button pagination__page-button--active"
              : "pagination__page-button"
          }
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === PAGE_NUMBERS.length}
        onClick={() =>
          setCurrentPage((page) => Math.min(PAGE_NUMBERS.length, page + 1))
        }
        className="pagination__arrow-button"
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
