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
    <div className="fixed inset-x-0 bottom-0 flex items-center justify-center gap-3 py-4">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={num === currentPage ? "text-black" : "text-gray-400"}
        >
          {num}
        </button>
      ))}
    </div>
  );
};
