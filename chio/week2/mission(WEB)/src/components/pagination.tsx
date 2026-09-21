interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        type="button"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  )
}
