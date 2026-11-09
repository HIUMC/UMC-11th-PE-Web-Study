import { useState } from "react";
import { cn } from "../../utils/cn";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="페이지 이동">
      {PAGE_NUMBERS.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "size-8 cursor-pointer rounded-md border border-line bg-white text-sm text-muted",
            page === currentPage && "border-brand bg-brand font-bold text-white",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}