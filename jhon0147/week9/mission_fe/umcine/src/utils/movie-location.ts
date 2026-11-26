export function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1;
}

export function movieListHref(page: number): string {
  const nextPage = readPage(String(page));
  return nextPage === 1 ? "/" : `/?page=${nextPage}`;
}

export function movieSearchHref(query: string, page = 1): string {
  const keyword = query.trim();
  if (!keyword) return "/search";
  const search = new URLSearchParams({ query: keyword });
  const nextPage = readPage(String(page));
  if (nextPage > 1) search.set("page", String(nextPage));
  return `/search?${search}`;
}
