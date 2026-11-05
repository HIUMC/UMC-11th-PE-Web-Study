export interface MovieCardData {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  overview: string;
}

export interface MovieDetailData extends MovieCardData {
  backdropPath: string | null;
  genres: string[];
  runtime: string;
  tagline: string;
}
