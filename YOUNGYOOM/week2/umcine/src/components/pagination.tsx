import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={num === currentPage ? "active" : ""}
        >
          {num}
        </button>
      ))}
    </div>
  );
};
