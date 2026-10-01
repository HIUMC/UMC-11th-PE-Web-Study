import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = [1, 2, 3, 4, 5];

  return (
    <nav className="pagination">
      <button className="pagination-arrow" aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={
            page === currentPage
              ? "pagination-page pagination-page-active"
              : "pagination-page"
          }
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
      <button className="pagination-arrow" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
