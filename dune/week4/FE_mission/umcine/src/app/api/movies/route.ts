import { type NextRequest } from "next/server";
import { getMovies } from "../../../api/movies/get-movies";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);

  if (!Number.isSafeInteger(page) || page < 1) {
    return Response.json({ message: "올바르지 않은 페이지 번호예요." }, { status: 400 });
  }

  try {
    return Response.json(await getMovies({ page }));
  } catch {
    return Response.json({ message: "영화 목록을 불러오지 못했어요." }, { status: 502 });
  }
}
