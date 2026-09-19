import "./pagination.css";
 
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}
 
// 모양만 구현한 정적 컴포넌트
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
 
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button type="button" className="pagination-button" aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-button${page === currentPage ? " pagination-button-active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button type="button" className="pagination-button" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}