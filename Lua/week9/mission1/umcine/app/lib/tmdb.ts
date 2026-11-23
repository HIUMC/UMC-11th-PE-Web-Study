export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
}

export interface MovieListResponse {
  results: Movie[];
}

const imageBaseUrl = "https://image.tmdb.org/t/p";

export function posterUrl(path: string | null, size = "w500") {
  return path ? `${imageBaseUrl}/${size}${path}` : null;
}

export function backdropUrl(path: string | null | undefined) {
  return path ? `${imageBaseUrl}/w1280${path}` : null;
}

export async function getMovies(path: string, searchParams?: URLSearchParams) {
  const query = searchParams ? `?${searchParams.toString()}` : "";
  const response = await fetch(`/api/tmdb/${path}${query}`);

  if (!response.ok) throw new Error("영화 정보를 불러오지 못했습니다.");
  return response.json();
}
