// TMDB에서 조회 가능한 페이지 범위로 URL 입력을 제한한다.
export const MAX_MOVIE_PAGE = 500;

export function readMoviePage(value: unknown): number | undefined {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    (typeof value === "string" && !/^\d+$/.test(value))
  ) {
    return undefined;
  }

  const page = Number(value);
  return Number.isSafeInteger(page) && page > 1 && page <= MAX_MOVIE_PAGE
    ? page
    : undefined;
}
