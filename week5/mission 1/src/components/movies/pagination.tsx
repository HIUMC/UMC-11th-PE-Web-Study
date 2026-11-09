import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const buttonClass = 'grid size-9 place-items-center rounded-md text-sm font-bold disabled:opacity-20'
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => startPage + index)
  return (
    <nav className="mt-8 flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button type="button" className={buttonClass} aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><img src="/icons/movie-icons/chevron-left.svg" alt="" width={20} height={20} /></button>
      {pages.map((page) => <button key={page} type="button" className={cn(buttonClass, page === currentPage && 'bg-[#191b20] text-white')} aria-label={`${page}페이지`} aria-current={page === currentPage ? 'page' : undefined} onClick={() => onPageChange(page)}>{page}</button>)}
      <button type="button" className={buttonClass} aria-label="다음 페이지" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><img src="/icons/movie-icons/chevron-right.svg" alt="" width={20} height={20} /></button>
    </nav>
  )
}
