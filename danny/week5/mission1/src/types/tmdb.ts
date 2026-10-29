export interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieListItem {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
}

export interface TmdbMovieDetail extends TmdbMovieListItem {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
}
