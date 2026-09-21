export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button className="pagination-button active">
        1
      </button>
      <button className="pagination-button">
        2
      </button>
      <button className="pagination-button">
        3
      </button>
      <button className="pagination-button">
        4
      </button>
      <button className="pagination-button">
        5
      </button>
    </nav>
  );
}