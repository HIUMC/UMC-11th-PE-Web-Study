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
  /** 2주차 원본 더미 필드. 실제 북마크 상태는 bookmark-store만 참조한다. */
  isBookmarked: boolean;
}
