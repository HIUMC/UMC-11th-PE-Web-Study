import { cn } from "../../utils/cn";

const PAGES = [1, 2, 3, 4, 5];
const CURRENT_PAGE = 1;

export default function Pagination() {
  return (
    <nav className="mt-[45px] flex items-center justify-center gap-2" aria-label="페이지 이동">
      {PAGES.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === CURRENT_PAGE ? "page" : undefined}
          className={cn(
            "h-8 w-8 cursor-pointer rounded-md border text-xs",
            page === CURRENT_PAGE
              ? "border-[#2563eb] bg-[#2563eb] text-white"
              : "border-[#dfe3e8] bg-white text-[#6b7280]",
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}