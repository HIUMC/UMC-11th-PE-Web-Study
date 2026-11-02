/** 카드와 검색 결과가 사용하는 UI 데이터. TMDB DTO와 분리한다. */
export interface MovieCardData {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  overview: string;
}
export interface Movie extends MovieCardData {
  backdropPath: string | null;
  genres: string[];
  runtime: string;
  tagline: string;
  /** 2주차 원본 더미 필드. 실제 북마크 상태는 bookmark-store만 참조한다. */
  isBookmarked?: boolean;
}
