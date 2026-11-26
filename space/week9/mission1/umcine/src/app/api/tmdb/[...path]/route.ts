import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!/^(movie\/(popular|[1-9]\d*)|search\/movie)$/.test(path)) {
    return NextResponse.json({ message: "지원하지 않는 영화 요청이에요." }, { status: 404 });
  }
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ message: "TMDB 환경 변수가 필요해요." }, { status: 503 });
  const url = new URL(`${process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3"}/${path}`);
  for (const key of ["query", "page", "language"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }
  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ message: "영화 서버에 연결하지 못했어요." }, { status: 502 });
  }
}
