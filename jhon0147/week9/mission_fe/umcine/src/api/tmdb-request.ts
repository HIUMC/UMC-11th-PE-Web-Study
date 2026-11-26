interface TmdbConfig { baseUrl: string; token: string }

// 서버에서 호출하며, 요청 경로와 전달할 검색 조건을 제한한다.
export function createTmdbRequest(config: TmdbConfig, fetcher: typeof fetch = fetch) {
  return async (path: string, search = new URLSearchParams(), signal?: AbortSignal): Promise<Response> => {
    const detail = /^movie\/([1-9]\d*)$/.exec(path);
    const validDetail = detail !== null && Number.isSafeInteger(Number(detail[1]));
    if (path !== "movie/popular" && path !== "search/movie" && !validDetail) {
      return Response.json({ message: "지원하지 않는 영화 API 경로예요." }, { status: 404 });
    }
    const token = config.token.trim();
    if (!token || token === "YOUR_TMDB_READ_ACCESS_TOKEN") {
      return Response.json({ message: "TMDB_TOKEN을 설정해 주세요." }, { status: 503 });
    }
    const url = new URL(`${config.baseUrl.replace(/\/+$/, "")}/${path}`);
    for (const key of ["language", "page", "query", "include_adult"]) {
      const value = search.get(key);
      if (value !== null) url.searchParams.set(key, value);
    }
    if (!url.searchParams.has("language")) url.searchParams.set("language", "ko-KR");
    return fetcher(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10_000)]) : AbortSignal.timeout(10_000),
    });
  };
}
