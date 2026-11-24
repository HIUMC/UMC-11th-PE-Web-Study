import { type NextRequest } from "next/server";
import { searchMovies } from "../../../../api/movies/search-movies";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return Response.json({ message: "검색어를 입력해 주세요." }, { status: 400 });
  }

  try {
    return Response.json(await searchMovies({ query }));
  } catch {
    return Response.json({ message: "검색 결과를 불러오지 못했어요." }, { status: 502 });
  }
}
