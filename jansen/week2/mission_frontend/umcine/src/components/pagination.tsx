import { useState } from "react";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {PAGE_NUMBERS.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-button ${page === currentPage ? "is-active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}