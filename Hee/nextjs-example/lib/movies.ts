import type { Movie } from "./types";

const raw = [
  [1,"스파이더맨: 브랜드 뉴 데이","Spider-Man: Brand New Day","2026.07.29","spider-man-brand-new-day",["SF","액션","모험"],"2시간 25분","스파이더맨의 새로운 날을 확인하라!","모두의 기억에서 사라진 피터 파커가 새로운 힘과 자신의 정체를 아는 적을 마주해요."],
  [2,"오디세이","The Odyssey","2026.08.05","odyssey",["모험","드라마"],"2시간 30분","집으로 돌아가기 위한 가장 긴 여정","긴 전쟁을 마친 영웅이 수많은 시련을 지나 고향으로 돌아가는 여정을 그려요."],
  [3,"스파이더맨: 노 웨이 홈","Spider-Man: No Way Home","2021.12.15","spider-man-no-way-home",["액션","모험","SF"],"2시간 28분","모든 세계의 운명이 하나로 이어진다","정체가 드러난 피터 파커가 도움을 청하는 과정에서 여러 세계의 문이 열려요."],
  [4,"라스트 하우스","The Last House","2026.08.07","last-house",["스릴러","미스터리"],"1시간 42분","마지막 문을 열면 진실이 드러난다","외딴 저택에 모인 사람들이 감춰진 사건의 흔적을 발견해요."],
  [5,"미니언즈 & 몬스터즈","Minions & Monsters","2026.07.15","minions-monsters",["애니메이션","코미디","모험"],"1시간 35분","작은 영웅들의 거대한 소동","미니언들이 도시를 찾아온 몬스터와 친구가 되며 새로운 모험을 시작해요."],
  [6,"군체","Colony","2026.05.21","colony",["SF","스릴러"],"1시간 48분","하나의 신호가 모두를 바꾼다","고립된 연구 기지의 구성원들이 정체를 알 수 없는 신호와 마주해요."],
  [7,"토이 스토리 5","Toy Story 5","2026.06.17","toy-story-5",["애니메이션","모험","가족"],"1시간 45분","장난감들의 새로운 모험이 시작된다","우디와 친구들이 새로운 주인을 만나며 장난감의 의미를 다시 찾아가요."],
  [8,"로빈 후드의 죽음","The Death of Robin Hood","2026.06.18","death-of-robin-hood",["액션","모험","드라마"],"2시간 10분","전설의 마지막 화살","오랜 싸움을 마친 로빈 후드가 자신의 마지막 선택과 마주해요."],
  [9,"옵세션","Obsession","2026.09.02","obsession",["스릴러","드라마"],"1시간 50분","완벽한 믿음이 집착으로 변한다","한 사람을 향한 믿음이 점차 위험한 집착으로 바뀌기 시작해요."],
  [10,"이블 데드 번","Evil Dead Burn","2026.07.07","evil-dead-burn",["공포","스릴러"],"1시간 40분","꺼진 불길 속에서 악이 깨어난다","버려진 오두막을 찾은 사람들이 오래 잠들어 있던 악을 깨워요."],
] as const;

export const movies: Movie[] = raw.map(([id,title,originalTitle,releaseDate,slug,genres,runtime,tagline,overview]) => ({
  id, title, originalTitle, releaseDate,
  posterPath: `/umcine-images/images/movies/${slug}.jpg`, backdropPath: `/umcine-images/images/movies/${slug}-backdrop.jpg`,
  genres: [...genres], runtime, tagline, overview,
}));

type TmdbMovie = {id:number;title:string;original_title:string;release_date:string;poster_path:string|null;backdrop_path:string|null;overview:string};
type TmdbList = {results: TmdbMovie[]; total_pages:number};
function adapt(movie: TmdbMovie): Movie { const image="https://image.tmdb.org/t/p/"; return {id:movie.id,title:movie.title,originalTitle:movie.original_title,releaseDate:movie.release_date,posterPath:movie.poster_path?`${image}w500${movie.poster_path}`:"",backdropPath:movie.backdrop_path?`${image}w1280${movie.backdrop_path}`:"",genres:[],runtime:"",tagline:"",overview:movie.overview}; }
async function tmdb(path:string) { const base=process.env.TMDB_API_BASE_URL; const token=process.env.TMDB_ACCESS_TOKEN; if(!base||!token)return null; const response=await fetch(`${base.replace(/\/$/,"")}/${path}`,{headers:{Authorization:`Bearer ${token}`},next:{revalidate:3600}}); if(!response.ok)throw new Error("영화 정보를 불러오지 못했어요."); return response; }
export async function getMovies(page=1) { const response=await tmdb(`movie/popular?language=ko-KR&page=${page}`); if(!response)return {results:movies,totalPages:1}; const data=await response.json() as TmdbList; return {results:data.results.map(adapt),totalPages:Math.min(data.total_pages,500)}; }
export async function searchMovies(query:string) { if(!query)return []; const response=await tmdb(`search/movie?language=ko-KR&include_adult=false&query=${encodeURIComponent(query)}`); if(!response){const needle=query.toLowerCase();return movies.filter((movie)=>`${movie.title} ${movie.originalTitle}`.toLowerCase().includes(needle));} const data=await response.json() as TmdbList; return data.results.map(adapt); }
export async function getMovie(id:number) { const local=movies.find((movie)=>movie.id===id); const response=await tmdb(`movie/${id}?language=ko-KR`); if(!response)return local; const data=await response.json() as TmdbMovie&{genres:{name:string}[];runtime:number|null;tagline:string}; return {...adapt(data),genres:data.genres.map(({name})=>name),runtime:data.runtime?`${data.runtime}분`:"",tagline:data.tagline}; }
