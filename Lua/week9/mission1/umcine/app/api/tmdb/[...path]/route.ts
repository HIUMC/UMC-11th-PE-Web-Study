import { NextResponse } from "next/server";

const allowedPaths = new Set(["movie/popular", "search/movie"]);

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/tmdb/[...path]">,
) {
  const { path } = await params;
  const targetPath = path.join("/");

  if (!allowedPaths.has(targetPath) && !/^movie\/\d+$/.test(targetPath)) {
    return NextResponse.json({ message: "허용되지 않은 TMDB 경로입니다." }, { status: 404 });
  }

  const baseUrl = process.env.TMDB_API_BASE_URL;
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!baseUrl || !accessToken) {
    return NextResponse.json({ message: "TMDB 환경 변수가 설정되지 않았습니다." }, { status: 500 });
  }

  const sourceUrl = new URL(`${targetPath}`, `${baseUrl.replace(/\/$/, "")}/`);
  const requestUrl = new URL(request.url);
  requestUrl.searchParams.forEach((value, key) => sourceUrl.searchParams.set(key, value));
  sourceUrl.searchParams.set("language", "ko-KR");

  const response = await fetch(sourceUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
