export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button type="button" className="page-arrow" disabled>
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>
      <button type="button" className="page-number active">1</button>
      <button type="button" className="page-arrow" disabled>
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </nav>
  );
}