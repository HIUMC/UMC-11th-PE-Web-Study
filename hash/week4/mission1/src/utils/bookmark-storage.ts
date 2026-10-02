const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(): number[] {
  try {
    const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);

    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) return [];

    const validIds = parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" &&
        Number.isInteger(movieId) &&
        movieId > 0,
    );

    return [...new Set(validIds)];
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]): void {
  try {
    localStorage.setItem(
      BOOKMARK_STORAGE_KEY,
      JSON.stringify(movieIds),
    );
  } catch (error) {
    console.warn("북마크를 브라우저에 저장하지 못했어요.", error);
  }
}