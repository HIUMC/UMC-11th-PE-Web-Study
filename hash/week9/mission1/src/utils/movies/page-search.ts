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

export function searchHref(query: string, page = 1) {
  const params = new URLSearchParams();
  const text = query.trim();
  if (text) params.set("query", text);
  if (text && page > 1) params.set("page", String(page));
  return text ? `/search?${params}` : "/search";
}

export function readMovieId(value: string): number | undefined {
  if (!/^[1-9]\d*$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}
