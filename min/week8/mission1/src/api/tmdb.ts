import ky from "ky";

const baseUrl = import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
export type TmdbMovie = { id: number; title: string; original_title: string; overview: string; poster_path: string | null; backdrop_path: string | null; release_date: string; vote_average: number; vote_count: number; genre_ids?: number[]; genres?: { id: number; name: string }[]; runtime?: number | null; tagline?: string };
type MovieResponse = { page: number; results: TmdbMovie[]; total_pages: number; total_results: number };
export async function fetchPopularWithFetch() { const response = await fetch(`${baseUrl}/movie/popular?language=ko-KR&page=1`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }); if (!response.ok) throw new Error(`TMDB 인기 영화 요청 실패 (${response.status})`); return response.json() as Promise<MovieResponse>; }
const tmdb = ky.create({ prefix: baseUrl, headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, timeout: 10000 });
export const movieApi = { popular: (page = 1) => tmdb.get("movie/popular", { searchParams: { language: "ko-KR", page } }).json<MovieResponse>(), search: (query: string, page = 1) => tmdb.get("search/movie", { searchParams: { language: "ko-KR", include_adult: "false", query, page } }).json<MovieResponse>(), detail: (id: number) => tmdb.get(`movie/${id}`, { searchParams: { language: "ko-KR" } }).json<TmdbMovie>() };
export const imageUrl = (path: string | null, size = "w500") => path ? `https://image.tmdb.org/t/p/${size}${path}` : "/images/movies/colony.jpg";
