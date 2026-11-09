import { cn } from '../../utils/cn'

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
    <nav className="mt-[38px] flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        className="h-[34px] min-w-[34px] cursor-pointer rounded-md border border-[#dfe4ea] bg-white disabled:cursor-default focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2"
        type="button"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          className={cn(
            'h-[34px] min-w-[34px] cursor-pointer rounded-md border focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
            page === currentPage
              ? 'border-[#2f67e8] bg-[#2f67e8] text-white'
              : 'border-[#dfe4ea] bg-white',
          )}
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="h-[34px] min-w-[34px] cursor-pointer rounded-md border border-[#dfe4ea] bg-white disabled:cursor-default focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2"
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
