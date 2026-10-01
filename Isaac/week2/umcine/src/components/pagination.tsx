const pages = [1, 2, 3, 4, 5];

export default function Pagination() {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" className="page-button" aria-label="이전 페이지">
        <img
          src="/icons/movie-icons/chevron-left.svg"
          alt=""
        />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-button ${page === 1 ? "active" : ""}`}
          aria-current={page === 1 ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button type="button" className="page-button" aria-label="다음 페이지">
        <img
          src="/icons/movie-icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}