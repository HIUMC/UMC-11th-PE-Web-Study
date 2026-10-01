type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const iconBase = "/icons/movie-icons/movie-icons";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="영화 목록 페이지" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded disabled:opacity-40"
      >
        <img src={`${iconBase}/chevron-left.svg`} alt="" className="h-5 w-5" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 rounded text-sm ${page === currentPage ? "bg-blue-600 font-semibold text-white" : "text-gray-600"}`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded disabled:opacity-40"
      >
        <img src={`${iconBase}/chevron-right.svg`} alt="" className="h-5 w-5" />
      </button>
    </nav>
  );
}
