import { cn } from "../../utils/cn";

export default function Pagination() {
  const currentPage = 1;

  return (
    <div className="mt-7 flex items-center justify-center gap-[14px]">
      <button
        type="button"
        disabled={currentPage === 1}
        className={cn(
          "flex h-7 w-5 items-center justify-center bg-transparent p-0 text-[22px] font-light",
          currentPage === 1
            ? "cursor-default text-[#dbeafe]"
            : "cursor-pointer text-[#2563eb]",
        )}
      >
        ‹
      </button>

      <button
        type="button"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[5px] bg-[#1f2329] p-0 text-[12px] font-semibold text-white"
      >
        1
      </button>

      <button
        type="button"
        className="flex h-7 w-5 cursor-pointer items-center justify-center bg-transparent p-0 text-[22px] font-light text-[#2563eb]"
      >
        ›
      </button>
    </div>
  );
}
