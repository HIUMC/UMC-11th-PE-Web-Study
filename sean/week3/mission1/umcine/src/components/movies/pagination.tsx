export function Pagination() {
  return (
    <nav className="mt-10 flex items-center justify-center gap-2 " aria-label="페이지 이동">
      <button 
        type="button" 
        disabled 
        aria-label="이전 페이지"
        className="flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-neutral-200 px-2 text-sm text-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
        <img className="block h-3.5 w-3.5" src="/icons/chevron-left.svg" alt="" />
      </button>
      <button type="button" className="pagination__page is-active" aria-current="page">
        1
      </button>
      <button type="button" 
        disabled 
        aria-label="다음 페이지"
        className="flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-neutral-200 px-2 text-sm text-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <img className="block h-3.5 w-3.5" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}