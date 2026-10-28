export interface MovieSummary {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
}

export interface Movie extends MovieSummary {
  genres: string[];
  runtime: string;
  tagline: string;
}

export interface MoviePage {
  movies: MovieSummary[];
  page: number;
  totalPages: number;
  totalResults: number;
}
