import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** 페이지 번호만 바꿔 붙일 기본 주소. 예: "/" 또는 "/search?query=영화" */
  buildHref: (nextPage: number) => string;
}

/**
 * 버튼 + onPageChange 대신 Link로 바뀌었습니다.
 * 페이지 번호가 URL(`?page=`)에 들어가므로 Server Component에서 데이터를 가져올 수 있고,
 * 새로고침하거나 주소를 공유해도 같은 페이지가 열립니다.
 */
export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const buttonClass =
    "rounded-md border border-neutral-300 px-3 py-2 text-sm";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {hasPrev ? (
        <Link href={buildHref(page - 1)} className={buttonClass}>
          이전
        </Link>
      ) : (
        <span className={`${buttonClass} opacity-40`}>이전</span>
      )}

      <span className="px-3 text-sm text-neutral-600">
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link href={buildHref(page + 1)} className={buttonClass}>
          다음
        </Link>
      ) : (
        <span className={`${buttonClass} opacity-40`}>다음</span>
      )}
    </nav>
  );
}
