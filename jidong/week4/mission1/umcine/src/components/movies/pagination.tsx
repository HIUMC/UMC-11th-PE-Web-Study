export default function Pagination() {
  return (
    <nav
      aria-label="페이지 이동"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white disabled:opacity-50"
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="h-4 w-4"
        />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-black bg-black text-sm text-white"
      >
        1
      </button>
      <button
        type="button"
        disabled
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white disabled:opacity-50"
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="h-4 w-4"
        />
      </button>
    </nav>
  );
}
