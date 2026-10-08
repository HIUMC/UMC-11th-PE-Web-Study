// 북마크 여부는 영화 데이터가 아니라 브라우저의 클라이언트 상태라서
// isBookmarked 필드를 빼고 stores/bookmark-store.ts에서 관리해요.
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
}
