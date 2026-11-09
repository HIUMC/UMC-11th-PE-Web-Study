// TMDB 목록 응답은 장르 ID만 주므로 한국어 이름으로 바꿔요.
const TMDB_GENRE_NAMES: Record<number, string> = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

export function getGenreNames(genreIds: number[]) {
  return genreIds.map((id) => TMDB_GENRE_NAMES[id]).filter((name): name is string => Boolean(name));
}
