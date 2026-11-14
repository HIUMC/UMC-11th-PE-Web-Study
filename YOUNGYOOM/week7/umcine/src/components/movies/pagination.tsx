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
  const groupSize = 5;
  const startPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);
  const pages = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i,
  );
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {totalPages > groupSize && (
        <button
          aria-label="이전 페이지 묶음"
          disabled={startPage === 1}
          onClick={() => onPageChange(startPage - groupSize)}
          className="disabled:text-gray-300"
        >
          &lt;
        </button>
      )}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={num === currentPage ? "text-black" : "text-gray-400"}
        >
          {num}
        </button>
      ))}
      {totalPages > groupSize && (
        <button
          aria-label="다음 페이지 묶음"
          disabled={endPage === totalPages}
          onClick={() => onPageChange(endPage + 1)}
          className="disabled:text-gray-300"
        >
          &gt;
        </button>
      )}
    </div>
  );
};
