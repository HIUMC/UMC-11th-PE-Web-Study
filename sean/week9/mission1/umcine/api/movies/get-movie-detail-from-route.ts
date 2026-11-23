import type { TmdbMovieDetail } from "./models";

/**
 * 클라이언트에서 쓰는 영화 상세 조회입니다.
 * TMDB가 아니라 우리 Next 서버의 Route Handler를 부릅니다.
 */
export async function getMovieDetailFromRoute(
  movieId: number,
): Promise<TmdbMovieDetail> {
  const response = await fetch(`/api/movies/${movieId}`);

  if (!response.ok) {
    throw new Error("영화 정보를 불러오지 못했어요.");
  }

  return response.json();
}
