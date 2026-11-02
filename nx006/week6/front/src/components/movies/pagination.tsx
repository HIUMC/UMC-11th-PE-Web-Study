import { Icon } from '../icon'
import { cn } from '../../utils/cn'
import { paginationPages } from '../../utils/pagination-pages'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages?: number
  disabled?: boolean
}

export function Pagination({ currentPage, onPageChange, totalPages = 5, disabled = false }: PaginationProps) {
  return (
    <nav className="mt-5 flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button type="button" className="grid size-6 place-items-center disabled:opacity-35" aria-label="이전 페이지" disabled={disabled || currentPage <= 1} onClick={() => onPageChange(Math.min(currentPage - 1, totalPages))}><Icon name="chevron-left" /></button>
      <div className="flex gap-1">
      {paginationPages(currentPage, totalPages).map(page => (
        <button className={cn('grid size-9 place-items-center rounded-[7px] text-[13px] font-bold text-[#606774]', currentPage === page && 'bg-[#17191e] text-white')} key={page} type="button"
          aria-label={page + '페이지'}
          aria-current={currentPage === page ? 'page' : undefined}
          disabled={disabled || currentPage === page}
          onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      </div>
      <button type="button" className="grid size-6 place-items-center disabled:opacity-35" aria-label="다음 페이지" disabled={disabled || currentPage >= totalPages} onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}><Icon name="chevron-right" /></button>
    </nav>
  )
}
