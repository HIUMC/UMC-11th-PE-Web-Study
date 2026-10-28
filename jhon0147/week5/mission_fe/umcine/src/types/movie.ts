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
  voteAverage: number;
}

export interface MoviePage {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}
