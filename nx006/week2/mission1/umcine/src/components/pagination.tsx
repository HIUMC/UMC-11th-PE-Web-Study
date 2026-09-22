import { Icon } from './icon'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages?: number
}

export function Pagination({ currentPage, onPageChange, totalPages = 5 }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" className="page-arrow" aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><Icon name="chevron-left" /></button>
      <div className="page-numbers">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
        <button key={page} type="button"
          aria-label={page + '페이지'}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      </div>
      <button type="button" className="page-arrow" aria-label="다음 페이지" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><Icon name="chevron-right" /></button>
    </nav>
  )
}
