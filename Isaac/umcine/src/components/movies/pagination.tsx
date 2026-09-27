import { cn } from "../../utils/cn";

const pages = [1, 2, 3, 4, 5];

export default function Pagination() {
  return (
    <nav
      className="mt-12 flex justify-center gap-2"
      aria-label="영화 목록 페이지"
    >
      <button
        type="button"
        className="grid size-9 place-items-center rounded-[6px] border border-[#e1e3e8] bg-white p-0"
        aria-label="이전 페이지"
      >
        <img
          className="size-5"
          src="/icons/movie-icons/chevron-left.svg"
          alt=""
        />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "grid size-9 place-items-center rounded-[6px]",
            "border border-[#e1e3e8] bg-white p-0 text-[#767676]",
            page === 1 &&
              "border-[#4f6ef7] bg-[#4f6ef7] text-white",
          )}
          aria-current={page === 1 ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="grid size-9 place-items-center rounded-[6px] border border-[#e1e3e8] bg-white p-0"
        aria-label="다음 페이지"
      >
        <img
          className="size-5"
          src="/icons/movie-icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}