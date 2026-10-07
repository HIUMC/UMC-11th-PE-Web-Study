import { useMemo, useState } from "react";
import { useBookmarkStore } from "./store/bookmark-store";
import "./styles.css";
import "./search.css";
import "./bookmark.css";

type Movie = { id: number; title: string; original: string; date: string; poster: string; backdrop: string; overview: string };
const baseMovies: Movie[] = [
  { id: 1, title: "스파이더맨: 브랜 뉴 데이", original: "Spider-Man: Brand New Day", date: "2026.07.29", poster: "/images/movies/spider-man-brand-new-day.jpg", backdrop: "/images/movies/spider-man-brand-new-day-backdrop.jpg", overview: "새로운 위협에 맞서는 스파이더맨의 이야기입니다." },
  { id: 2, title: "오디세이", original: "The Odyssey", date: "2026.08.05", poster: "/images/movies/odyssey.jpg", backdrop: "/images/movies/odyssey-backdrop.jpg", overview: "집으로 돌아가기 위한 긴 모험을 시작합니다." },
  { id: 3, title: "토이 스토리 5", original: "Toy Story 5", date: "2026.06.17", poster: "/images/movies/toy-story-5.jpg", backdrop: "/images/movies/toy-story-5-backdrop.jpg", overview: "친구들과 함께 새로운 모험을 떠납니다." },
  { id: 4, title: "미니언즈 & 몬스터즈", original: "Minions & Monsters", date: "2026.07.15", poster: "/images/movies/minions-monsters.jpg", backdrop: "/images/movies/minions-monsters-backdrop.jpg", overview: "미니언들의 유쾌한 모험입니다." },
  { id: 5, title: "콜로니", original: "Colony", date: "2026.05.21", poster: "/images/movies/colony.jpg", backdrop: "/images/movies/colony-backdrop.jpg", overview: "정체를 알 수 없는 신호를 마주합니다." },
];
const movies: Movie[] = [...baseMovies,
  { id: 6, title: "The Last House", original: "The Last House", date: "2026.08.07", poster: "/images/movies/last-house.jpg", backdrop: "/images/movies/last-house-backdrop.jpg", overview: "A mysterious story unfolds." },
  { id: 7, title: "The Death of Robin Hood", original: "The Death of Robin Hood", date: "2026.06.18", poster: "/images/movies/death-of-robin-hood.jpg", backdrop: "/images/movies/death-of-robin-hood-backdrop.jpg", overview: "The final chapter of a legend." },
  { id: 8, title: "Evil Dead Burn", original: "Evil Dead Burn", date: "2026.07.07", poster: "/images/movies/evil-dead-burn.jpg", backdrop: "/images/movies/evil-dead-burn-backdrop.jpg", overview: "A terrifying story begins." },
  { id: 9, title: "Obsession", original: "Obsession", date: "2026.09.02", poster: "/images/movies/obsession.jpg", backdrop: "/images/movies/obsession-backdrop.jpg", overview: "An obsession changes everything." },
  { id: 10, title: "Spider-Man 3", original: "Spider-Man 3", date: "2007.05.01", poster: "/images/movies/spider-man-brand-new-day.jpg", backdrop: "/images/movies/spider-man-brand-new-day-backdrop.jpg", overview: "Spider-Man faces a new danger." },
];
const icon = (name: string) => `/icons/movie-icons/${name}.svg`;

function BookmarkButton({ movieId }: { movieId: number }) {
  const bookmarked = useBookmarkStore((state) => state.bookmarkedIds.includes(movieId));
  const toggle = useBookmarkStore((state) => state.toggleBookmark);
  return <button className="bookmark-button" type="button" aria-label={bookmarked ? "북마크 제거" : "북마크 추가"} aria-pressed={bookmarked} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(movieId); }}><img src={icon(bookmarked ? "bookmark" : "bookmark-outline")} alt="" /></button>;
}
function Header() { return <header className="header"><a className="brand" href="/"><img src={icon("movie")} alt="" />UMCine</a><nav><a href="/">영화</a><a href="/search">검색</a></nav></header>; }
function MovieList() { return <main className="movie-list"><h1>영화 목록</h1><div className="list-grid">{movies.map((movie) => <a className="poster-card" key={movie.id} href={`/movies/${movie.id}`}><div className="poster-wrap"><img src={movie.poster} alt={movie.title} /><BookmarkButton movieId={movie.id} /></div><b>{movie.title}</b><small>{movie.date}</small></a>)}</div></main>; }
function SearchPage() { const params = new URLSearchParams(location.search); const query = params.get("query") ?? ""; const [value, setValue] = useState(query); const result = useMemo(() => movies.filter((movie) => `${movie.title} ${movie.original}`.toLowerCase().includes(query.toLowerCase())), [query]); return <main className="search-page"><h1>영화 검색</h1><form className="search-box" onSubmit={(event) => { event.preventDefault(); location.href = value ? `/search?query=${encodeURIComponent(value)}` : "/search"; }}><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="영화 제목을 검색해보세요" /><button type="submit">검색</button></form>{query && <div className="result-grid">{result.map((movie) => <a className="card" key={movie.id} href={`/movies/${movie.id}`}><img className="poster" src={movie.poster} alt={movie.title} /><h3>{movie.title}</h3><BookmarkButton movieId={movie.id} /></a>)}</div>}</main>; }
function Detail({ movie }: { movie?: Movie }) { if (!movie) return <main><h1>영화를 찾을 수 없습니다.</h1></main>; const bookmarked = useBookmarkStore((state) => state.bookmarkedIds.includes(movie.id)); const toggle = useBookmarkStore((state) => state.toggleBookmark); return <main className="detail"><section className="hero" style={{ backgroundImage: `url(${movie.backdrop})` }}><h1>{movie.title}</h1><p>{movie.original}</p></section><section className="detail-body"><img className="detail-poster" src={movie.poster} alt={movie.title} /><div><h2>{movie.title}</h2><p>{movie.overview}</p><button className="blue-btn" type="button" aria-pressed={bookmarked} onClick={() => toggle(movie.id)}>{bookmarked ? "북마크 제거" : "북마크 추가"}</button></div></section></main>; }
export default function App() { const path = location.pathname; const match = path.match(/^\/movies\/(\d+)/); const page = path === "/search" ? <SearchPage /> : match ? <Detail movie={movies.find((movie) => movie.id === Number(match[1]))} /> : <MovieList />; return <><Header />{page}</>; }
