import { NextResponse } from "next/server";
import { getMovieDetail } from "@/api/movies/get-movie-detail";

/**
 * TMDB 토큰이 서버 전용이라 브라우저에서는 TMDB를 직접 부를 수 없습니다.
 * 마이페이지의 즐겨찾기 목록처럼 클라이언트에서 영화 정보가 필요할 때,
 * 이 Route Handler가 대신 TMDB에 다녀옵니다.
 *
 * Next.js가 풀스택 프레임워크라는 말이 이런 뜻입니다.
 * 화면 코드와 서버 코드가 같은 프로젝트에 있습니다.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params;
  const parsedMovieId = Number(movieId);

  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return NextResponse.json(
      { message: "올바르지 않은 영화 번호예요." },
      { status: 400 },
    );
  }

  try {
    const movie = await getMovieDetail(parsedMovieId);
    return NextResponse.json(movie);
  } catch {
    return NextResponse.json(
      { message: "영화 정보를 불러오지 못했어요." },
      { status: 502 },
    );
  }
}
