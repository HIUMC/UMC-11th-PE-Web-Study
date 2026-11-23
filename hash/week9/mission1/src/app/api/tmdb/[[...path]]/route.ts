import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import { MAX_MOVIE_PAGE, readMovieId } from "../../../../utils/movies/page-search";

export async function GET(request: NextRequest, context: RouteContext<"/api/tmdb/[[...path]]">) {
  const { path = [] } = await context.params;
  const [resource, item] = path;
  const isList = path.length === 2 && resource === "movie" && item === "popular";
  const isSearch = path.length === 2 && resource === "search" && item === "movie";
  const movieId = path.length === 2 && resource === "movie" ? readMovieId(item) : undefined;

  if (!isList && !isSearch && movieId === undefined) {
    return NextResponse.json({ message: "지원하지 않는 영화 경로예요." }, { status: 404 });
  }

  const params = new URLSearchParams({ language: "ko-KR" });
  if (isList || isSearch) {
    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const value = Number(page);
    if (!/^\d+$/.test(page) || value < 1 || value > MAX_MOVIE_PAGE) {
      return NextResponse.json({ message: "올바르지 않은 페이지 번호예요." }, { status: 400 });
    }
    params.set("page", String(value));
  }

  if (isSearch) {
    const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
    if (!query || query.length > 200) {
      return NextResponse.json({ message: "검색어는 1~200자로 입력해 주세요." }, { status: 400 });
    }
    params.set("query", query);
    params.set("include_adult", "false");
  }

  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ message: "서버의 TMDB 설정을 확인해 주세요." }, { status: 503 });
  }

  const apiBase = (process.env.TMDB_API_BASE_URL?.trim() || "https://api.themoviedb.org/3").replace(/\/+$/, "");
  const endpoint = isList ? "movie/popular" : isSearch ? "search/movie" : `movie/${movieId}`;

  try {
    const response = await fetch(`${apiBase}/${endpoint}?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      const status = movieId !== undefined && response.status === 404 ? 404 : 502;
      return NextResponse.json({ message: "TMDB에서 영화 데이터를 불러오지 못했어요." }, { status });
    }
    const data: unknown = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "TMDB에 연결하지 못했어요." }, { status: 502 });
  }
}
